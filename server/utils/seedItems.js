const Item = require('../models/Item');

const defaultItems = [
  {
    title: 'TI-84 Plus CE Graphing Calculator',
    description: 'Color screen graphing calculator in excellent condition. Perfect for Calculus, Linear Algebra, and Engineering exams. Comes with charging cable and sliding case.',
    category: 'Calculator',
    images: [{ url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 40,
    pricePerWeek: 180,
    securityDeposit: 300,
    condition: 'Like New',
    location: 'North Campus, Library',
    availabilityStatus: 'available',
    tags: ['calculator', 'engineering', 'math', 'ti-84'],
  },
  {
    title: 'Arduino Ultimate Starter Kit + Sensor Pack',
    description: 'Complete Arduino Uno R3 kit with 35+ sensors, breadboard, jumper wires, servo motor, LCD display, and ultrasonic sensor. Ideal for semester IoT and hardware projects.',
    category: 'Project Equipment',
    images: [{ url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 60,
    pricePerWeek: 250,
    securityDeposit: 400,
    condition: 'Good',
    location: 'ECE Lab Block, Hostel 3',
    availabilityStatus: 'available',
    tags: ['arduino', 'iot', 'hardware', 'sensors'],
  },
  {
    title: 'Chemistry / Bio Lab Coat & UV Safety Goggles',
    description: 'Standard 100% white cotton lab coat (Size M) with splash-resistant safety goggles. Meets all university chemistry and biology laboratory requirements.',
    category: 'Lab Equipment',
    images: [{ url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 25,
    pricePerWeek: 100,
    securityDeposit: 150,
    condition: 'Like New',
    location: 'Science Block 2',
    availabilityStatus: 'available',
    tags: ['lab', 'chemistry', 'goggles', 'coat'],
  },
  {
    title: 'Hero Sprint 21-Speed Mountain Bicycle',
    description: 'Well-maintained geared bicycle with dual disc brakes, front suspension, and a sturdy phone mount. Great for commuting between hostel and academic departments.',
    category: 'Bicycle',
    images: [{ url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 80,
    pricePerWeek: 350,
    securityDeposit: 600,
    condition: 'Good',
    location: 'Hostel Block A Cycle Stand',
    availabilityStatus: 'available',
    tags: ['cycle', 'bicycle', 'commute', 'transport'],
  },
  {
    title: 'Sony WH-1000XM4 Noise-Cancelling Headphones',
    description: 'Industry-leading ANC headphones with 30-hour battery life. Incredible for deep focus, studying in noisy dorms, or exam prep sessions. Comes with carry case.',
    category: 'Headphones',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 70,
    pricePerWeek: 300,
    securityDeposit: 500,
    condition: 'Like New',
    location: 'Central Library Lounge',
    availabilityStatus: 'available',
    tags: ['headphones', 'sony', 'anc', 'audio'],
  },
  {
    title: 'Canon EOS 1500D DSLR Camera + 18-55mm Lens',
    description: '24.1 MP DSLR with EF-S 18-55mm IS II Lens, 64GB SD card, and extra battery. Perfect for campus fest coverage, photography club shoots, and video projects.',
    category: 'Camera',
    images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 150,
    pricePerWeek: 650,
    securityDeposit: 1000,
    condition: 'Like New',
    location: 'Media Arts Center',
    availabilityStatus: 'available',
    tags: ['camera', 'dslr', 'photography', 'canon'],
  },
  {
    title: 'CLRS Introduction to Algorithms (4th Edition)',
    description: 'Hardcover edition of the classic Algorithms textbook by Cormen, Leiserson, Rivest, and Stein. Essential reference for DSA coursework and competitive programming.',
    category: 'Books',
    images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 15,
    pricePerWeek: 70,
    securityDeposit: 100,
    condition: 'Good',
    location: 'Computer Science Dept',
    availabilityStatus: 'available',
    tags: ['book', 'algorithms', 'cs', 'clrs'],
  },
  {
    title: 'Raspberry Pi 4 Model B (4GB RAM) with Case & Fan',
    description: 'Raspberry Pi 4 mini computer loaded with Raspberry Pi OS on a 32GB high-speed MicroSD card. Includes official power supply and micro-HDMI cable.',
    category: 'Electronics',
    images: [{ url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80' }],
    pricePerDay: 50,
    pricePerWeek: 220,
    securityDeposit: 350,
    condition: 'Like New',
    location: 'Robotics Club Room',
    availabilityStatus: 'available',
    tags: ['raspberry-pi', 'electronics', 'linux', 'iot'],
  },
];

const seedItems = async (adminUserId) => {
  try {
    const count = await Item.countDocuments();
    if (count === 0 && adminUserId) {
      const itemsToInsert = defaultItems.map((item) => ({
        ...item,
        owner: adminUserId,
      }));
      await Item.insertMany(itemsToInsert);
      console.log(`📦 Seeded ${defaultItems.length} default rental items into MongoDB Atlas.`);
    }
  } catch (error) {
    console.warn('⚠️  Could not seed default items:', error.message);
  }
};

module.exports = seedItems;
