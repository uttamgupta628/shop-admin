// USERS
export const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    joined: "2024-01-10"
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Customer",
    status: "Active",
    joined: "2024-02-15"
  },
  {
    id: 3,
    name: "Michael Lee",
    email: "michael@example.com",
    role: "Customer",
    status: "Inactive",
    joined: "2024-03-20"
  }
];


// PRODUCTS
export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    stock: 45,
    category: "Electronics",
    images: [
      "/images/headphones-1.jpg",
      "/images/headphones-2.jpg"
    ]
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 4999,
    stock: 20,
    category: "Electronics",
    images: [
      "/images/watch-1.jpg",
      "/images/watch-2.jpg"
    ]
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 1499,
    stock: 60,
    category: "Accessories",
    images: [
      "/images/mouse-1.jpg",
      "/images/mouse-2.jpg"
    ]
  }
];


// ORDERS
export const orders = [
  {
    id: "#ORD1001",
    customer: "John Doe",
    amount: 2999,
    status: "Delivered",
    date: "2024-06-10"
  },
  {
    id: "#ORD1002",
    customer: "Sarah Smith",
    amount: 4999,
    status: "Processing",
    date: "2024-06-11"
  },
  {
    id: "#ORD1003",
    customer: "Michael Lee",
    amount: 1499,
    status: "Cancelled",
    date: "2024-06-12"
  }
];


// REVENUE DATA (Charts)
export const revenueData = [
  { month: "Jan", revenue: 5000 },
  { month: "Feb", revenue: 8000 },
  { month: "Mar", revenue: 12000 },
  { month: "Apr", revenue: 15000 },
  { month: "May", revenue: 18000 },
  { month: "Jun", revenue: 22000 }
];


// ANALYTICS
export const analyticsData = [
  { name: "Visitors", value: 4000 },
  { name: "Orders", value: 2400 },
  { name: "Revenue", value: 3200 },
  { name: "Customers", value: 1800 }
];


// NOTIFICATIONS
export const notifications = [
  {
    id: 1,
    message: "New order received",
    time: "5 minutes ago"
  },
  {
    id: 2,
    message: "New user registered",
    time: "1 hour ago"
  },
  {
    id: 3,
    message: "Server maintenance scheduled",
    time: "Yesterday"
  }
];


// ACTIVITIES
export const activities = [
  {
    id: 1,
    user: "Admin",
    action: "Added new product",
    time: "2 hours ago"
  },
  {
    id: 2,
    user: "Admin",
    action: "Updated product price",
    time: "4 hours ago"
  },
  {
    id: 3,
    user: "System",
    action: "Backup completed",
    time: "1 day ago"
  }
];


// SUPPORT TICKETS
export const supportTickets = [
  {
    id: 1,
    user: "John Doe",
    issue: "Payment not processed",
    status: "Open"
  },
  {
    id: 2,
    user: "Sarah Smith",
    issue: "Order delay",
    status: "Pending"
  }
];


// PROJECTS
export const projects = [
  {
    id: 1,
    name: "Ecommerce Website",
    progress: 70
  },
  {
    id: 2,
    name: "Admin Dashboard",
    progress: 50
  }
];


// TASKS
export const tasks = [
  {
    id: 1,
    title: "Add new products",
    completed: false
  },
  {
    id: 2,
    title: "Update homepage",
    completed: true
  }
];


// MONTHLY REVENUE
export const monthlyRevenue = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 15000 },
  { month: "Mar", amount: 18000 },
  { month: "Apr", amount: 20000 }
];


// TRAFFIC SOURCES
export const trafficSources = [
  { source: "Google", visitors: 5000 },
  { source: "Facebook", visitors: 3000 },
  { source: "Instagram", visitors: 2000 }
];


// USER ACTIVITY
export const userActivity = [
  { day: "Mon", users: 120 },
  { day: "Tue", users: 200 },
  { day: "Wed", users: 150 },
  { day: "Thu", users: 250 },
  { day: "Fri", users: 300 }
];


// SALES BY CATEGORY
export const salesByCategory = [
  { category: "Electronics", sales: 4000 },
  { category: "Fashion", sales: 3000 },
  { category: "Accessories", sales: 2000 }
];