const courseCategories = [
    { title: 'Programming', description: '<p>All about <strong>programming</strong></p>', shortDescription: 'Programming', isPremium: true, slug: 'programming' },
    { title: 'Design', description: '<p>All about <strong>design</strong></p>', shortDescription: 'Design', isPremium: false, slug: 'design' },
    { title: 'Marketing', description: '<p>All about <strong>marketing</strong></p>', shortDescription: 'Marketing', isPremium: false, slug: 'marketing' },
    { title: 'Business', description: '<p>All about <strong>business</strong></p>', shortDescription: 'Business', isPremium: true, slug: 'business' },
    { title: 'Photography', description: '<p>All about <strong>photography</strong></p>', shortDescription: 'Photography', isPremium: false, slug: 'photography' },
    { title: 'Music', description: '<p>All about <strong>music</strong></p>', shortDescription: 'Music', isPremium: true, slug: 'music' },
    { title: 'Health', description: '<p>All about <strong>health</strong></p>', shortDescription: 'Health', isPremium: false, slug: 'health' },
    { title: 'Fitness', description: '<p>All about <strong>fitness</strong></p>', shortDescription: 'Fitness', isPremium: true, slug: 'fitness' },
    { title: 'Cooking', description: '<p>All about <strong>cooking</strong></p>', shortDescription: 'Cooking', isPremium: false, slug: 'cooking' },
    { title: 'Travel', description: '<p>All about <strong>travel</strong></p>', shortDescription: 'Travel', isPremium: true, slug: 'travel' }
];

const users = [
    { name: 'John Doe', email: 'john@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '1234567890', location: { addr: '123 Main St', state: 'CA', city: 'San Francisco', country: 'USA' } },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '0987654321', location: { addr: '456 Elm St', state: 'NY', city: 'New York', country: 'USA' } },
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '1112223333', location: { addr: '789 Oak St', state: 'TX', city: 'Dallas', country: 'USA' } },
    { name: 'Bob Brown', email: 'bob@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '4445556666', location: { addr: '101 Pine St', state: 'FL', city: 'Miami', country: 'USA' } },
    { name: 'Carol White', email: 'carol@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '7778889999', location: { addr: '202 Maple St', state: 'IL', city: 'Chicago', country: 'USA' } },
    { name: 'Dave Green', email: 'dave@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '1213141516', location: { addr: '303 Cedar St', state: 'WA', city: 'Seattle', country: 'USA' } },
    { name: 'Eve Black', email: 'eve@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '1718192021', location: { addr: '404 Birch St', state: 'NV', city: 'Las Vegas', country: 'USA' } },
    { name: 'Frank Blue', email: 'frank@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '2324252627', location: { addr: '505 Willow St', state: 'CO', city: 'Denver', country: 'USA' } },
    { name: 'Grace Yellow', email: 'grace@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '2829303132', location: { addr: '606 Aspen St', state: 'GA', city: 'Atlanta', country: 'USA' } },
    { name: 'Hank Orange', email: 'hank@example.com', password: 'hashed_password', profilePic: 'path/to/profilePic.jpg', phone: '3334353637', location: { addr: '707 Cherry St', state: 'NC', city: 'Charlotte', country: 'USA' } }
];

const courses = [
    { title: 'JavaScript Basics', slug: 'javascript-basics', shortDescription: 'Learn the basics of JavaScript', text: '<p>Detailed course content for <strong>JavaScript Basics</strong></p>', courseDuration: '3 weeks', difficulty: 'Beginner', language: ['English'], price: 100, currency: 'USD', rating: 4.5, categories: [], instructors: [] },
    { title: 'Advanced CSS', slug: 'advanced-css', shortDescription: 'Learn advanced CSS techniques', text: '<p>Detailed course content for <strong>Advanced CSS</strong></p>', courseDuration: '2 weeks', difficulty: 'Advanced', language: ['English'], price: 150, currency: 'USD', rating: 4.8, categories: [], instructors: [] },
    { title: 'Digital Marketing', slug: 'digital-marketing', shortDescription: 'Learn digital marketing strategies', text: '<p>Detailed course content for <strong>Digital Marketing</strong></p>', courseDuration: '4 weeks', difficulty: 'Intermediate', language: ['English'], price: 200, currency: 'USD', rating: 4.2, categories: [], instructors: [] },
    { title: 'Business Analytics', slug: 'business-analytics', shortDescription: 'Learn business analytics', text: '<p>Detailed course content for <strong>Business Analytics</strong></p>', courseDuration: '6 weeks', difficulty: 'Advanced', language: ['English'], price: 300, currency: 'USD', rating: 4.7, categories: [], instructors: [] },
    { title: 'Photography 101', slug: 'photography-101', shortDescription: 'Learn the basics of photography', text: '<p>Detailed course content for <strong>Photography 101</strong></p>', courseDuration: '3 weeks', difficulty: 'Beginner', language: ['English'], price: 120, currency: 'USD', rating: 4.4, categories: [], instructors: [] },
    { title: 'Music Theory', slug: 'music-theory', shortDescription: 'Learn the basics of music theory', text: '<p>Detailed course content for <strong>Music Theory</strong></p>', courseDuration: '5 weeks', difficulty: 'Intermediate', language: ['English'], price: 180, currency: 'USD', rating: 4.6, categories: [], instructors: [] },
    { title: 'Health and Wellness', slug: 'health-and-wellness', shortDescription: 'Learn about health and wellness', text: '<p>Detailed course content for <strong>Health and Wellness</strong></p>', courseDuration: '3 weeks', difficulty: 'Beginner', language: ['English'], price: 110, currency: 'USD', rating: 4.3, categories: [], instructors: [] },
    { title: 'Fitness Training', slug: 'fitness-training', shortDescription: 'Learn fitness training techniques', text: '<p>Detailed course content for <strong>Fitness Training</strong></p>', courseDuration: '4 weeks', difficulty: 'Intermediate', language: ['English'], price: 140, currency: 'USD', rating: 4.5, categories: [], instructors: [] },
    { title: 'Culinary Arts', slug: 'culinary-arts', shortDescription: 'Learn the basics of culinary arts', text: '<p>Detailed course content for <strong>Culinary Arts</strong></p>', courseDuration: '6 weeks', difficulty: 'Advanced', language: ['English'], price: 250, currency: 'USD', rating: 4.9, categories: [], instructors: [] },
    { title: 'Travel Blogging', slug: 'travel-blogging', shortDescription: 'Learn the basics of travel blogging', text: '<p>Detailed course content for <strong>Travel Blogging</strong></p>', courseDuration: '2 weeks', difficulty: 'Beginner', language: ['English'], price: 130, currency: 'USD', rating: 4.1, categories: [], instructors: [] }
];

const webinars = [
    { title: 'Web Development Webinar', shortDescription: 'Learn web development', content: '<p>Webinar content for <strong>Web Development Webinar</strong></p>', startDate: '2024-06-01', slug: 'web-development-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 50, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Graphic Design Webinar', shortDescription: 'Learn graphic design', content: '<p>Webinar content for <strong>Graphic Design Webinar</strong></p>', startDate: '2024-07-01', slug: 'graphic-design-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 60, currency: 'USD', hosts: [], createdBy: null },
    { title: 'SEO Techniques Webinar', shortDescription: 'Learn SEO techniques', content: '<p>Webinar content for <strong>SEO Techniques Webinar</strong></p>', startDate: '2024-08-01', slug: 'seo-techniques-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 70, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Data Science Webinar', shortDescription: 'Learn data science', content: '<p>Webinar content for <strong>Data Science Webinar</strong></p>', startDate: '2024-09-01', slug: 'data-science-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 80, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Social Media Marketing Webinar', shortDescription: 'Learn social media marketing', content: '<p>Webinar content for <strong>Social Media Marketing Webinar</strong></p>', startDate: '2024-10-01', slug: 'social-media-marketing-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 90, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Blockchain Technology Webinar', shortDescription: 'Learn blockchain technology', content: '<p>Webinar content for <strong>Blockchain Technology Webinar</strong></p>', startDate: '2024-11-01', slug: 'blockchain-technology-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 100, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Machine Learning Webinar', shortDescription: 'Learn machine learning', content: '<p>Webinar content for <strong>Machine Learning Webinar</strong></p>', startDate: '2024-12-01', slug: 'machine-learning-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 110, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Cloud Computing Webinar', shortDescription: 'Learn cloud computing', content: '<p>Webinar content for <strong>Cloud Computing Webinar</strong></p>', startDate: '2024-06-15', slug: 'cloud-computing-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 120, currency: 'USD', hosts: [], createdBy: null },
    { title: 'Cybersecurity Webinar', shortDescription: 'Learn cybersecurity', content: '<p>Webinar content for <strong>Cybersecurity Webinar</strong></p>', startDate: '2024-07-15', slug: 'cybersecurity-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 130, currency: 'USD', hosts: [], createdBy: null },
    { title: 'AI and Robotics Webinar', shortDescription: 'Learn AI and robotics', content: '<p>Webinar content for <strong>AI and Robotics Webinar</strong></p>', startDate: '2024-08-15', slug: 'ai-robotics-webinar', thumbnail: 'path/to/thumbnail.jpg', price: 140, currency: 'USD', hosts: [], createdBy: null }
];

export {
    courseCategories,
    users,
    courses,
    webinars
}
