// Customer Support Dashboard - All Sections Working

let tickets = [];
let currentTicketId = null;

// Demo Data
const demoTickets = [
    {
        id: 't1',
        ticketNumber: 'SUP-001',
        customerName: 'John Smith',
        customerEmail: 'john@email.com',
        subject: 'Booking confirmation not received',
        message: 'I booked the Pyramids tour but never got a confirmation email.',
        priority: 'high',
        status: 'open',
        createdAt: '2026-04-15',
        replies: []
    },
    {
        id: 't2',
        ticketNumber: 'SUP-002',
        customerName: 'Sarah Ahmed',
        customerEmail: 'sarah@email.com',
        subject: 'Change travel dates',
        message: 'I need to change my Cairo tour from June 1 to June 5.',
        priority: 'medium',
        status: 'in-progress',
        createdAt: '2026-04-14',
        replies: [{ message: 'We are checking availability.', date: '2026-04-14' }]
    },
    {
        id: 't3',
        ticketNumber: 'SUP-003',
        customerName: 'Michael Brown',
        customerEmail: 'michael@email.com',
        subject: 'Refund request',
        message: 'I cancelled my booking but haven\'t received refund.',
        priority: 'high',
        status: 'escalated',
        createdAt: '2026-04-10',
        replies: []
    },
    {
        id: 't4',
        ticketNumber: 'SUP-004',
        customerName: 'Emily Davis',
        customerEmail: 'emily@email.com',
        subject: 'General question about tours',
        message: 'Do you offer student discounts?',
        priority: 'low',
        status: 'resolved',
        createdAt: '2026-04-12',
        replies: [{ message: 'Yes, 10% discount with valid student ID.', date: '2026-04-12' }]
    }
];

function loadData() {
    tickets = [...demoTickets];
    updateStats();
    updateDashboard();
    renderTickets();
    renderEscalated();
    renderCustomers();
}

function updateStats() {
    document.querySelector('.open-badge').textContent = `Open: ${tickets.filter(t => t.status === 'open').length}`;
    document.querySelector('.progress-badge').textContent = `Progress: ${tickets.filter(t => t.status === 'in-progress').length}`;
    document.querySelector('.resolved-badge').textContent = `Resolved: ${tickets.filter(t => t.status === 'resolved').length}`;
}

function updateDashboard() {
    let total = tickets.length;
    let escalated = tickets.filter(t => t.status === 'escalated').length;
    let resolved = tickets.filter(t => t.status === 'resolved').length;
    let resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    document.getElementById('dashTotalTickets').textContent = total;
    document.getElementById('dashEscalated').textContent = escalated;
    document.getElementById('dashResolution').textContent = resolutionRate + '%';

    let avgResponse = tickets.reduce((sum, t) => sum + t.replies.length, 0);
    document.getElementById('dashAvgResponse').textContent = avgResponse > 0 ? '2 hrs' : '0 hrs';

    let recent = document.getElementById('recentActivity');
    recent.innerHTML = '';
    let sorted = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    sorted.slice(0, 5).forEach(t => {
        recent.innerHTML += `
            <div class="activity-item">
                <strong>${t.ticketNumber}</strong> - ${t.subject}<br>
                <small>${t.customerName} | Status: ${t.status} | Created: ${t.createdAt}</small>
            </div>
        `;
    });
}

function renderTickets() {
    let filtered = [...tickets];

    let search = document.getElementById('searchInput').value.toLowerCase();
    if (search) {
        filtered = filtered.filter(t =>
            t.customerName.toLowerCase().includes(search) ||
            t.subject.toLowerCase().includes(search)
        );
    }

    let status = document.getElementById('statusFilter').value;
    if (status !== 'all') {
        filtered = filtered.filter(t => t.status === status);
    }

    let priority = document.getElementById('priorityFilter').value;
    if (priority !== 'all') {
        filtered = filtered.filter(t => t.priority === priority);
    }

    let container = document.getElementById('ticketsContainer');
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;">No tickets found</p>';
        return;
    }

    filtered.forEach(t => {
        let template = document.getElementById('ticketCardTemplate');
        let card = template.content.cloneNode(true);

        card.querySelector('.ticket-id').textContent = t.ticketNumber;

        let prioritySpan = card.querySelector('.ticket-priority');
        prioritySpan.textContent = t.priority.toUpperCase();
        prioritySpan.classList.add(`priority-${t.priority}`);

        let statusSpan = card.querySelector('.ticket-status');
        let statusText = t.status === 'in-progress' ? 'IN PROGRESS' : t.status.toUpperCase();
        statusSpan.textContent = statusText;
        statusSpan.classList.add(`status-${t.status}`);

        card.querySelector('.ticket-subject').textContent = t.subject;
        card.querySelector('.ticket-customer').textContent = `${t.customerName} (${t.customerEmail})`;
        card.querySelector('.ticket-message').textContent = t.message.substring(0, 100) + (t.message.length > 100 ? '...' : '');
        card.querySelector('.ticket-date').textContent = `Created: ${t.createdAt}`;

        card.querySelector('.view-reply-btn').onclick = () => openTicket(t.id);

        container.appendChild(card);
    });
}

function renderEscalated() {
    let escalated = tickets.filter(t => t.status === 'escalated');
    let container = document.getElementById('escalatedContainer');
    container.innerHTML = '';

    if (escalated.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;">No escalated tickets</p>';
        return;
    }

    escalated.forEach(t => {
        let template = document.getElementById('ticketCardTemplate');
        let card = template.content.cloneNode(true);

        card.querySelector('.ticket-id').textContent = t.ticketNumber;

        let prioritySpan = card.querySelector('.ticket-priority');
        prioritySpan.textContent = t.priority.toUpperCase();
        prioritySpan.classList.add(`priority-${t.priority}`);

        let statusSpan = card.querySelector('.ticket-status');
        statusSpan.textContent = 'ESCALATED';
        statusSpan.classList.add('status-escalated');

        card.querySelector('.ticket-subject').textContent = t.subject;
        card.querySelector('.ticket-customer').textContent = `${t.customerName} (${t.customerEmail})`;
        card.querySelector('.ticket-message').textContent = t.message.substring(0, 100);
        card.querySelector('.ticket-date').textContent = `Created: ${t.createdAt}`;

        card.querySelector('.view-reply-btn').onclick = () => openTicket(t.id);

        container.appendChild(card);
    });
}

function renderCustomers() {
    let customerMap = new Map();
    tickets.forEach(t => {
        if (!customerMap.has(t.customerEmail)) {
            customerMap.set(t.customerEmail, {
                name: t.customerName,
                email: t.customerEmail,
                tickets: []
            });
        }
        customerMap.get(t.customerEmail).tickets.push(t);
    });

    let customers = Array.from(customerMap.values());
    let container = document.getElementById('customersContainer');
    container.innerHTML = '';

    let search = document.getElementById('customerSearchInput').value.toLowerCase();
    if (search) {
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        );
    }

    if (customers.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;">No customers found</p>';
        return;
    }

    customers.forEach(c => {
        let card = document.createElement('div');
        card.className = 'customer-card';
        card.innerHTML = `
            <div class="customer-info">
                <h4>${c.name}</h4>
                <p>${c.email}</p>
            </div>
            <div class="customer-tickets">${c.tickets.length} tickets</div>
        `;
        container.appendChild(card);
    });
}

function openTicket(id) {
    currentTicketId = id;
    let t = tickets.find(t => t.id === id);

    let replyHistory = '';
    if (t.replies.length > 0) {
        replyHistory = '<div class="reply-history"><strong>Previous Replies:</strong><br>';
        t.replies.forEach(r => {
            replyHistory += `<small>[${r.date}] Support: ${r.message}</small><br>`;
        });
        replyHistory += '</div>';
    }

    let details = document.getElementById('ticketDetails');
    details.innerHTML = `
        <p><strong>Ticket #:</strong> ${t.ticketNumber}</p>
        <p><strong>Customer:</strong> ${t.customerName}</p>
        <p><strong>Email:</strong> ${t.customerEmail}</p>
        <p><strong>Subject:</strong> ${t.subject}</p>
        <p><strong>Priority:</strong> ${t.priority.toUpperCase()}</p>
        <p><strong>Status:</strong> ${t.status.toUpperCase()}</p>
        <p><strong>Created:</strong> ${t.createdAt}</p>
        <p><strong>Message:</strong></p>
        <p class="ticket-message">${t.message}</p>
        ${replyHistory}
    `;

    document.getElementById('ticketModal').showModal();
}

function openReplyModal() {
    let t = tickets.find(t => t.id === currentTicketId);
    document.getElementById('replyCustomerName').textContent = t.customerName;
    document.getElementById('replySubject').textContent = t.subject;
    document.getElementById('replyMessage').value = '';
    document.getElementById('replyStatus').value = t.status;
    document.getElementById('replyModal').showModal();
}

function sendReply() {
    let message = document.getElementById('replyMessage').value;
    if (!message) {
        alert('Please enter a reply message');
        return;
    }

    let t = tickets.find(t => t.id === currentTicketId);
    let newStatus = document.getElementById('replyStatus').value;

    t.replies.push({
        message: message,
        date: new Date().toISOString().split('T')[0]
    });
    t.status = newStatus;

    updateStats();
    updateDashboard();
    renderTickets();
    renderEscalated();
    renderCustomers();
    document.getElementById('replyModal').close();
    document.getElementById('ticketModal').close();
}

function openEscalateModal() {
    let t = tickets.find(t => t.id === currentTicketId);
    document.getElementById('escalateCustomerName').textContent = t.customerName;
    document.getElementById('escalateReason').value = '';
    document.getElementById('adminNote').value = '';
    document.getElementById('escalateModal').showModal();
}

function escalateTicket() {
    let reason = document.getElementById('escalateReason').value;
    if (!reason) {
        alert('Please provide a reason for escalation');
        return;
    }

    let t = tickets.find(t => t.id === currentTicketId);
    t.status = 'escalated';

    updateStats();
    updateDashboard();
    renderTickets();
    renderEscalated();
    renderCustomers();
    document.getElementById('escalateModal').close();
    document.getElementById('ticketModal').close();
    alert('Ticket escalated to Admin');
}

function switchSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}Section`).classList.add('active');

    document.querySelectorAll('nav a').forEach(a => {
        a.classList.remove('active');
    });
    event.target.classList.add('active');
}

function closeAllModals() {
    let modals = ['ticketModal', 'replyModal', 'escalateModal'];
    modals.forEach(m => {
        let modal = document.getElementById(m);
        if (modal && modal.open) modal.close();
    });
}

function setupFilters() {
    let searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderTickets());
    }

    let statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => renderTickets());
    }

    let priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', () => renderTickets());
    }

    let customerSearch = document.getElementById('customerSearchInput');
    if (customerSearch) {
        customerSearch.addEventListener('input', () => renderCustomers());
    }
}

function setupEventListeners() {
    document.getElementById('replyBtn').onclick = openReplyModal;
    document.getElementById('escalateBtn').onclick = openEscalateModal;
    document.getElementById('sendReplyBtn').onclick = sendReply;
    document.getElementById('confirmEscalateBtn').onclick = escalateTicket;

    let closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.onclick = closeAllModals;
    });

    document.getElementById('closeTicketBtn').onclick = () => document.getElementById('ticketModal').close();
    document.getElementById('cancelReplyBtn').onclick = () => document.getElementById('replyModal').close();
    document.getElementById('cancelEscalateBtn').onclick = () => document.getElementById('escalateModal').close();

    document.querySelectorAll('nav a').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            let section = link.getAttribute('data-section');
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}Section`).classList.add('active');
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        };
    });
}

function init() {
    loadData();
    setupFilters();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);