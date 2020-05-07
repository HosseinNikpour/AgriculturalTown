// export const columns = [
//     { sortable: true, resizable: true, filter: true, field: 'id', headerName: 'شناسه' },
//     { sortable: true, resizable: true, filter: true, field: 'title', headerName: 'عنوان' },
//     { sortable: true, resizable: true, filter: true, field: 'sort', headerName: 'ترتیب' },

// ];

export const columns = [
    { key: 'id', dataIndex: 'id', title: 'شناسه' },
    { key: 'title', dataIndex: 'title', title: 'عنوان' },
    { key: 'sort', dataIndex: 'sort', title: 'ترتیب' },

];

export const storeIndex = "BaseInfo";
export const pageHeder = 'اطلاعات پایه';
export const types = [{ value: 1, label: 'استان ها' },
{ value: 2, label: 'نوع شهرک' },
{ value: 3, label: 'موقعیت (زون)' },
{ value: 4, label: 'نو ع مالکیت' },
{ value: 5, label: 'منبع تخصیص آب' },
{ value: 6, label: 'منبع تخصیص برق' },
{ value: 7, label: 'منبع تخصیص گاز' },
{ value: 8, label: 'نوع قرارداد' },
{ value: 9, label: 'نوع گواهینامه' },
{ value: 11, label: 'واحد ها' },
{ value: 12, label: 'گروه عملیات اجرایی' },
{ value: 13, label: 'شماره های تمدید' },
]
export const emptyItem = { title: '', sort: '' };