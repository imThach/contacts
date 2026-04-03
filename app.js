const API_URL = 'https://687f4c3aefe65e52008922e1.mockapi.io/user/directory';
let allContacts = [];
let contactIdToDelete = null;

// Cache DOM Elements
const DOM = {
    grid: document.getElementById('contact-grid'),
    form: document.getElementById('contact-form'),
    searchInput: document.getElementById('search-input'),
    mainModal: document.getElementById('modal'),
    deleteModal: document.getElementById('delete-modal'),
    modalTitle: document.getElementById('modal-title'),
    btnSubmit: document.getElementById('btn-submit'),
    idInput: document.getElementById('contact-id'),
    nameInput: document.getElementById('name'),
    phoneInput: document.getElementById('phone'),
    emailInput: document.getElementById('email'),
    addressInput: document.getElementById('address')
};
// xử lý hợp lệ 
const Validator = {
    showError(inputId, msg) {
        const errEl = document.getElementById(`error-${inputId}`);
        const inputEl = document.getElementById(inputId);
        if (errEl) { errEl.innerText = msg; errEl.classList.remove('hidden'); }
        inputEl?.classList.add('border-red-500', 'focus:ring-red-200');
    },
    reset() {
        document.querySelectorAll('[id^="error-"]').forEach(e => e.classList.add('hidden'));
        document.querySelectorAll('input, textarea').forEach(i =>
            i.classList.remove('border-red-500', 'focus:ring-red-200')
        );
    },
    isValid() {
        this.reset();
        const name = DOM.nameInput.value.trim();
        const phone = DOM.phoneInput.value.trim();
        const email = DOM.emailInput.value.trim();
        const address = DOM.addressInput.value.trim();

        let ok = true;
        if (name.length < 3) { this.showError('name', 'Họ tên tối thiểu 3 ký tự'); ok = false; }
        if (!/^[0-9+]+$/.test(phone)) { this.showError('phone', 'Số điện thoại chỉ chứa số và dấu "+"'); ok = false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.showError('email', 'Email không hợp lệ'); ok = false; }
        if (address && address.length < 5) { this.showError('address', 'Địa chỉ ít nhất 5 ký tự'); ok = false; }
        return ok;
    }
};

async function fetchContacts() {
    try {
        const res = await fetch(API_URL);
        allContacts = await res.json();
        renderContacts(allContacts);
    } catch (e) { console.error("Lỗi fetch:", e); }
}

async function saveContact(e) {
    e.preventDefault();
    if (!Validator.isValid()) return;
    const id = DOM.idInput.value;
    const data = {
        fullName: DOM.nameInput.value,
        phoneNumber: DOM.phoneInput.value,
        email: DOM.emailInput.value,
        address: DOM.addressInput.value
    };

    try {
        const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) { closeModal(); fetchContacts(); }
    } catch (e) { alert("Lỗi lưu dữ liệu"); }
}
function openModal(id = null) {
    Validator.reset();
    DOM.mainModal.classList.add('active');
    document.body.classList.add('modal-open');

    if (!id) {
        DOM.modalTitle.innerText = 'Thêm Danh Bạ Mới';
        DOM.btnSubmit.innerText = 'Thêm';
        DOM.form.reset();
        DOM.idInput.value = '';
    } else {
        DOM.modalTitle.innerText = 'Chỉnh Sửa Danh Bạ';
        DOM.btnSubmit.innerText = 'Cập nhật';
    }

    setTimeout(() => {
        DOM.nameInput.focus();
        if (id) DOM.nameInput.select();
    }, 300);
}

function closeModal() {
    DOM.mainModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

async function editContact(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const c = await res.json();

        DOM.idInput.value = c.id;
        DOM.nameInput.value = c.fullName;
        DOM.phoneInput.value = c.phoneNumber;
        DOM.emailInput.value = c.email;
        DOM.addressInput.value = c.address || '';

        openModal(id);
    } catch (e) { alert("Lỗi tải thông tin"); }
}

function deleteContact(id) {
    contactIdToDelete = id;
    DOM.deleteModal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeDeleteModal() {
    DOM.deleteModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    contactIdToDelete = null;
}
document.getElementById('btn-confirm-delete').onclick = async () => {
    if (!contactIdToDelete) return;
    await fetch(`${API_URL}/${contactIdToDelete}`, { method: 'DELETE' });
    closeDeleteModal();
    fetchContacts();
};
function renderContacts(contacts) {
    DOM.grid.innerHTML = contacts.map(c => `
        <div class="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
            <h3 class="font-semibold text-lg truncate mb-3">${c.fullName}</h3>
            <div class="space-y-2 text-sm text-gray-600 flex-1">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>${c.phoneNumber}</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                    <span class="break-all">${c.email}</span>
                </div>
                ${c.address ? `
                <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span class="line-clamp-2">${c.address}</span>
                </div>` : ''}
            </div>
            <div class="flex gap-2 pt-3">
                <button onclick="editContact('${c.id}')" 
                    class="flex-1 inline-flex items-center justify-center gap-2 border px-[10px] py-1 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen">
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                    </svg>
                    <span>Sửa</span>
                </button>
                <button onclick="deleteContact('${c.id}')" 
                    class="flex-1 inline-flex items-center justify-center gap-2 border border-red-100 text-red-600 px-[10px] py-1 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                    </svg>
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    `).join('');
}
DOM.searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allContacts.filter(c =>
        c.fullName?.toLowerCase().includes(term) ||
        c.phoneNumber?.includes(term) ||
        c.email?.toLowerCase().includes(term)
    );
    renderContacts(filtered);
};
DOM.form.onsubmit = saveContact;
fetchContacts();
window.openModal = openModal;
window.closeModal = closeModal;
window.closeDeleteModal = closeDeleteModal;
window.editContact = editContact;
window.deleteContact = deleteContact;