
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
    { dataIndex: 'title', key: 'title', title: 'نام اختصاری' },
    { dataIndex: 'meli_code', key: 'meli_code', title: 'شناسه ملی' },
    { dataIndex: 'economic_code', key: 'economic_code', title: 'کد اقتصادی' },
    { dataIndex: 'registration_number', key: 'registration_number', title: 'شماره ثبت' },
    { dataIndex: 'certificate_type_id', key: 'certificate_type_id', title: 'نوع گواهینامه' },
    { dataIndex: 'province', key: 'province', title: 'استان' },
    { dataIndex: 'city', key: 'city', title: 'شهرستان' },
    { dataIndex: 'tell', key: 'tell', title: 'تلفن' },
    { dataIndex: 'fax', key: 'fax', title: 'فکس' },
    // { key: 'rating1', title: 'رتبه های اخذ شده مشاور' },
    // { key: 'rating2', title: 'رتبه های اخذ شده پیمانکار' },
];
export const storeIndex = "Company";
export const pageHeder = 'شناسنامه شرکت ها';

export const emptyItem = {
    title: '', full_title: '', meli_code: '', economic_code: '', registration_number: '', registration_province_id: '', certificate_type_id: '', province_id: '', city: '', address: '', postalcode: '', tell: '', fax: '', rating1: '', rating2: ''
};