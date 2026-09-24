const Item = require('../models/Item');
const RentalBooking = require('../models/RentalBooking');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get all rental items with search and filters
 * @route   GET /api/items
 * @access  Public / Authenticated
 */
exports.getItems = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    condition,
    location,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (condition && condition !== 'All') {
    query.condition = condition;
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
  if (sort === 'price_desc') sortOption = { pricePerDay: -1 };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const items = await Item.find(query)
    .populate('owner', 'name college branch year profileImage trustScore')
    .skip(skip)
    .limit(parseInt(limit, 10))
    .sort(sortOption);

  const total = await Item.countDocuments(query);

  sendSuccess(res, 200, 'Items fetched', {
    items,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
  });
});

/**
 * @desc    Get single item details + booked date ranges for calendar blocking
 * @route   GET /api/items/:id
 * @access  Public / Authenticated
 */
exports.getItemById = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate('owner', 'name email college branch year profileImage trustScore bio location averageRating');

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  // Fetch approved & active bookings to provide calendar blackout dates
  const activeBookings = await RentalBooking.find({
    item: item._id,
    status: { $in: ['approved', 'active'] },
    endDate: { $gte: new Date() },
  }).select('startDate endDate status');

  sendSuccess(res, 200, 'Item retrieved', {
    item,
    bookedRanges: activeBookings.map((b) => ({
      startDate: b.startDate,
      endDate: b.endDate,
    })),
  });
});

/**
 * @desc    Create a new rental item listing
 * @route   POST /api/items
 * @access  Private
 */
exports.createItem = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    images,
    pricePerDay,
    pricePerWeek,
    securityDeposit,
    condition,
    location,
    tags,
  } = req.body;

  if (!title || !description || !category || !pricePerDay || !location) {
    return next(new AppError('Please provide title, description, category, daily price, and location.', 400));
  }

  // Formatted image array
  let itemImages = [];
  if (Array.isArray(images) && images.length > 0) {
    itemImages = images.map((img) => (typeof img === 'string' ? { url: img } : img));
  } else if (typeof images === 'string') {
    itemImages = [{ url: images }];
  } else {
    // Default placeholder
    itemImages = [{ url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' }];
  }

  const item = await Item.create({
    owner: req.user._id,
    title: title.trim(),
    description: description.trim(),
    category,
    images: itemImages,
    pricePerDay: Number(pricePerDay),
    pricePerWeek: pricePerWeek ? Number(pricePerWeek) : Number(pricePerDay) * 6,
    securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
    condition: condition || 'Good',
    location: location.trim(),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
    availabilityStatus: 'available',
  });

  const populated = await Item.findById(item._id)
    .populate('owner', 'name college branch year profileImage trustScore');

  sendSuccess(res, 201, 'Item listed successfully!', { item: populated });
});

/**
 * @desc    Update item listing (Owner only)
 * @route   PUT /api/items/:id
 * @access  Private
 */
exports.updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to update this listing.', 403));
  }

  const allowedUpdates = [
    'title',
    'description',
    'category',
    'images',
    'pricePerDay',
    'pricePerWeek',
    'securityDeposit',
    'condition',
    'location',
    'availabilityStatus',
    'tags',
    'isActive',
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      item[field] = req.body[field];
    }
  });

  await item.save();

  const updated = await Item.findById(req.params.id)
    .populate('owner', 'name college branch year profileImage trustScore');

  sendSuccess(res, 200, 'Item updated successfully', { item: updated });
});

/**
 * @desc    Delete item listing (Owner only)
 * @route   DELETE /api/items/:id
 * @access  Private
 */
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to delete this listing.', 403));
  }

  // Soft delete or remove
  item.isActive = false;
  await item.save();

  sendSuccess(res, 200, 'Item listing removed successfully');
});

/**
 * @desc    Get current user's listed items
 * @route   GET /api/items/my-items
 * @access  Private
 */
exports.getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ owner: req.user._id, isActive: true })
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Your listed items fetched', { items });
});
