import React, { Component } from 'react';
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
    { dataIndex: 'title',key: 'title', title: 'عنوان' }, 
    { dataIndex: 'province',key: 'province', title: 'استان' }, 
    { dataIndex: 'city',key: 'city', title: 'شهرستان' }, 
    { dataIndex: 'gross_area',key: 'gross_area', title: 'مساحت ناخالص' }, 
    { dataIndex: 'pure_area',key: 'pure_area', title: 'مساحت خالص' }, 
    // { dataIndex: 'inityear',key: 'inityear', title: 'inityear' }, 
    { dataIndex: 'activity_type',key: 'activity_type', title: ' نوع فعالیت' }, 
    // { dataIndex: 'ownership_type',key: 'ownership_type', title: 'ownership_type' }, 
    // { dataIndex: 'water_supply',key: 'water_supply', title: 'water_supply' }, 
     { dataIndex: 'water_rate',key: 'water_rate', title: 'میزان تخصیص آب (لیتر بر ثانیه)' }, 
    // { dataIndex: 'power_supply',key: 'power_supply', title: 'power_supply' }, 
    // { dataIndex: 'power_rate',key: 'power_rate', title: 'power_rate' }, 
    // { dataIndex: 'gas_supply',key: 'gas_supply', title: 'gas_supply' }, 
    // { dataIndex: 'gas_rate',key: 'gas_rate', title: 'gas_rate' }, 
   // { dataIndex: 'total_units',key: 'total_units', title: 'تعداد واحد ها' }, 
    // { dataIndex: 'used_units',key: 'used_units', title: 'تعداد واحدهای در حال بهره برداری' }, 
    // { dataIndex: 'used_number',key: 'used_number', title: 'used_number' }, 
    // { dataIndex: 'location',key: 'location', title: 'location' }, 
    // { dataIndex: 'coordinate_e',key: 'coordinate_e', title: 'coordinate_e' }, 
    // {dataIndex: 'coordinate_n',key: 'coordinate_n', title: 'coordinate_n' }, 
  //  { dataIndex: 'water_quality_ec',key: 'water_quality_ec', title: 'کیفیت آب -EC (میکروزیمنس بر سانتیمتر)' }, 
  //  { dataIndex: 'water_quality_ph',key: 'water_quality_ph', title: 'کیفیت آب  -PH' }, 
   // { dataIndex: 'water_quality_tds',key: 'water_quality_tds', title: ' کیفیت  آب  -TDS (میلی‌گرم بر لیتر)' },
   //  { dataIndex: 'file_dxf',key: 'file_dxf', title: 'بارگزاری فایل کروکی DXF',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
   //  { dataIndex: 'file_kmz',key: 'file_kmz', title: 'بارگزاری فایل کروکی KMZ',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
   //  { dataIndex: 'file_plan',key: 'file_plan', title: 'بارگذاری فایل  pdf  پلان شهرک',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
];
export const storeIndex = "Town";
export const pageHeder = 'شناسنامه شهرک ها';

export const emptyItem = {
    title : '' ,province_id : '' ,city : '' ,gross_area : '' ,pure_area : '' ,inityear : '' ,
    activity_type_id : '' ,ownership_type_id : '' ,water_supply_id : '' ,water_rate : '' ,
    power_supply_id : '' ,power_rate : '' ,gas_supply_id : '' ,gas_rate : '' ,total_units : '' ,
    used_units : '' ,used_number : '' ,location_id : '' ,coordinate_e : '' ,coordinate_n : '' ,
    file_dxf : '' ,water_quality_ec: '' ,water_quality_ph: '' ,water_quality_tds: '' ,    file_kmz : '' , file_plan : '' ,f_file_dxf : '' ,f_file_kmz : '',operation_type_id:[],water_index_id:'',
    description:'', exploitable_area:0,operating_area :0
    
};