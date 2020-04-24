
export const columns = [
{ dataIndex: 'title',key: 'title', title: 'عنوان اختصاری قرارداد' },
 //{ dataIndex: 'full_title',key: 'full_title', title: 'عنوان قرارداد' },
 { dataIndex: 'contract_no',key: 'contract_no', title: 'شماره قرارداد' }, 
 { dataIndex: 'project',key: 'project', title: 'نام پروژه' }, 
 { dataIndex: 'company',key: 'company', title: 'شرکت' }, 
 //{ dataIndex: 'colleague1_id',key: 'colleague1', title: 'شرکت همکار1' }, 
// { dataIndex: 'colleague2_id',key: 'colleague2', title: 'شرکت همکار2' }, 
 { dataIndex: 'contract_type',key: 'contract_type', title: 'نوع قرارداد' }, 
 { dataIndex: 'contract_date',key: 'contract_date', title: 'تاریخ قرارداد' },
 //{ dataIndex: 'announcement_date',key: 'announcement_date', title: 'تاریخ ابلاغ قرارداد' }, 
 //{ dataIndex: 'land_delivery_date',key: 'land_delivery_date', title: 'تاریخ تحویل زمین' }, 
 //{ dataIndex: 'end_date',key: 'end_date', title: 'تاریخ اولیه اتمام' }, 
 //{ dataIndex: 'duration',key: 'duration', title: 'مدت' },
 { dataIndex: 'initial_amount',key: 'initial_amount', title: 'مبلغ اولیه' }, 
 //{ dataIndex: 'client_initial_amount',key: 'client_initial_amount', title: 'مبلغ برآورد اولیه کارفرما' }, 
 //{ dataIndex: 'coefficient',key: 'coefficient', title: 'ضریب ' },
 //{ dataIndex: 'file_agreement',key: 'file_agreement', title: 'موافقتنامه ' },
 //{ dataIndex: 'file_announcement',key: 'file_announcement', title: 'صورتجلسه ابلاغ' },
 //{ dataIndex: 'file_delivery',key: 'file_delivery', title: 'صورتجلسه تحویل زمین' },
 //{ dataIndex: 'project_manager_name',key: 'project_manager_name', title: 'مدیر پروژه' },
 //{ dataIndex: 'project_manager_contacts',key: 'project_manager_contacts', title: 'تلفن همراه مدیر پروژه' },
 { dataIndex: 'contractor_user',key: 'contractor_user', title: 'کابر پیمانکار' },
 { dataIndex: 'engineer_user',key: 'engineer_user', title: 'کاربر مشاور' },
 { dataIndex: 'manager_user',key: 'manager_user', title: 'کاربر مدیراستان' },
];
export const storeIndex = "Contract";
export const pageHeder = 'شناسنامه قرارداد';

export const emptyItem = {title : '' ,full_title : '' ,contract_no : '' ,project_id: '' ,company_id : '' ,
colleague1_id : '' ,colleague2_id : '' ,contract_type_id : '' ,contract_date : undefined ,announcement_date : '' ,
land_delivery_date : '' ,end_date : '' ,duration : '' ,initial_amount : undefined ,client_initial_amount : undefined ,
coefficient : undefined ,file_agreement : '' ,file_announcement : '' ,file_delivery : '' ,project_manager_name : '' ,
project_manager_contacts : '',contractor_user_id :'',engineer_user_id:'' ,manager_user_id:''  }







