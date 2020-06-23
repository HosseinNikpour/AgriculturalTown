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
{ value: 14, label: 'شماره های صورت وضعیت' },
{ value: 15, label: 'نوع حق الزحمه' },
{ value: 16, label: 'نوع اعتبار' },
{ value: 17, label: 'نوع پرداخت' },
{ value: 18, label: 'شاخص های اصلی کیفیت آب' },
/*{ value: 19, label: 'نوع عملیات' },*/
{ value: 20, label: 'وضعیت جوی' },
{ value: 21, label: 'وضعیت کارگاه' },
{ value: 22, label: 'انواع ماشین آلات' },
{ value: 23, label: 'چرخه پیمان' },
{ value: 24, label: 'گروه' },
{ value: 25, label: 'نوع مناقصه' },
{ value: 26, label: 'نوع خدمات' },
{ value: 27, label: 'وضعیت اسناد' },
{ value: 28, label: 'مراحل بررسی' },
{ value: 29, label: 'نتیجه کمیسیون' },
{ value: 30, label: 'شماره تغییر مقادیر' },
{ value: 31, label: 'کلوزهای خریداری شده' },
{ value: 32, label: 'نوع بیمه' },
{ value: 33, label: 'نام بیمه گر' },
{ value: 34, label: 'شماره بیمه نامه' },
{ value: 35, label: 'فراخوان' },
{ value: 36, label: 'روش دعوت' },
]
export const emptyItem = { title: '', sort: '' };