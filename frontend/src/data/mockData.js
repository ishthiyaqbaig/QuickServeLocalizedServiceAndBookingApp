export const MOCK_USERS = {
    customer: {
        id: 'c1',
        name: 'Alex Johnson',
        email: 'alex.j@example.com',
        phone: '+1 (555) 123-4567',
        role: 'CUSTOMER',
        address: '123 Maple Ave, Springfield, IL',
        avatar: 'https://i.pravatar.cc/150?u=c1'
    },
    provider: {
        id: 'p1',
        name: 'Sarah Smith',
        email: 'sarah.s@example.com',
        phone: '+1 (555) 987-6543',
        role: 'PROVIDER',
        serviceCategory: 'Plumbing',
        rating: 4.8,
        reviews: 124,
        bio: 'Expert plumber with 10 years of experience. Specializing in emergency repairs and installations.',
        avatar: 'https://i.pravatar.cc/150?u=p1'
    }
};

export const MOCK_SERVICES = [
    {
        id: 's1',
        providerId: 'p1',
        providerName: 'Sarah Smith',
        category: 'Plumbing',
        title: 'Emergency Pipe Repair',
        description: 'Quick fix for leaking pipes and burst water lines.',
        price: 80,
        rating: 4.8,
        location: 'Springfield, IL',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 's2',
        providerId: 'p2',
        providerName: 'Mike Ross',
        category: 'Electrical',
        title: 'Full Home Wiring',
        description: 'Complete electrical wiring for new renovations.',
        price: 120,
        rating: 4.9,
        location: 'Springfield, IL',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 's3',
        providerId: 'p3',
        providerName: 'Clean Co.',
        category: 'Cleaning',
        title: 'Deep House Cleaning',
        description: 'Thorough cleaning of all rooms, including carpets and windows.',
        price: 150,
        rating: 4.7,
        location: 'Shelbyville, IL',
        image: 'https://images.unsplash.com/photo-1581578731117-104f2a41272c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 's4',
        providerId: 'p4',
        providerName: 'Green Thumb',
        category: 'Gardening',
        title: 'Lawn Maintenance',
        description: 'Weekly mowing, trimming, and edging services.',
        price: 45,
        rating: 4.6,
        location: 'Springfield, IL',
        image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
];

export const MOCK_APPOINTMENTS = [
    {
        id: 'a1',
        serviceId: 's1',
        customerId: 'c1',
        providerId: 'p1',
        serviceTitle: 'Emergency Pipe Repair',
        providerName: 'Sarah Smith',
        customerName: 'Alex Johnson',
        date: '2025-12-10',
        time: '10:00 AM',
        status: 'Confirmed',
        location: '123 Maple Ave, Springfield, IL',
        price: 80
    },
    {
        id: 'a2',
        serviceId: 's3',
        customerId: 'c1',
        providerId: 'p3',
        serviceTitle: 'Deep House Cleaning',
        providerName: 'Clean Co.',
        customerName: 'Alex Johnson',
        date: '2025-12-15',
        time: '02:00 PM',
        status: 'Pending',
        location: '123 Maple Ave, Springfield, IL',
        price: 150
    }
];
