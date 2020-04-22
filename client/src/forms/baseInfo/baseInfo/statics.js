// export const columns = [
//     { sortable: true, resizable: true, filter: true, field: 'id', headerName: 'شناسه' },
//     { sortable: true, resizable: true, filter: true, field: 'title', headerName: 'عنوان' },
//     { sortable: true, resizable: true, filter: true, field: 'sort', headerName: 'ترتیب' },

// ];

export const columns = [
    { sorter: true, key: 'id', dataIndex: 'id', title: 'شناسه' },
    { sorter: true, key: 'title', dataIndex: 'title', title: 'عنوان' },
    { sorter: true, key: 'sort', dataIndex: 'sort', title: 'ترتیب' },

];

export const storeIndex = "BaseInfo";
export const pageHeder = 'اطلاعات پایه';
export const types = [{ value: 1, label: 'استان ها' },
{ value: 2, label: 'نوع شهرک' },
{ value: 3, label: 'موقعیت (زون)' },
{ value: 4, label: 'نو ع مالیکیت' },
{ value: 5, label: 'منبع تخصیص آب' },
{ value: 6, label: 'منبع تخصیص برق' },
{ value: 7, label: 'منبع تخصیص گاز' },
{ value: 8, label: 'نوع قرارداد' },
{ value: 9, label: 'نوع گواهینامه' },
]
export const emptyItem = { title: '', sort: '' };