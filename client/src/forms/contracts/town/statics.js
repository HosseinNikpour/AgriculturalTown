
export const columns = [
    { dataIndex: 'title',key: 'title', title: 'عنوان' }, 
    { dataIndex: 'province',key: 'province', title: 'استان' }, 
    { dataIndex: 'city',key: 'city', title: 'شهرستان' }, 
    { dataIndex: 'gross_area',key: 'gross_area', title: 'مساحت ناخالص' }, 
    { dataIndex: 'pure_area',key: 'pure_area', title: 'مساحت خالص' }, 
    // { dataIndex: 'inityear',key: 'inityear', title: 'inityear' }, 
    // { dataIndex: 'activity_type',key: 'activity_type', title: 'activity_type' }, 
    // { dataIndex: 'ownership_type',key: 'ownership_type', title: 'ownership_type' }, 
    // { dataIndex: 'water_supply',key: 'water_supply', title: 'water_supply' }, 
    // { dataIndex: 'water_rate',key: 'water_rate', title: 'water_rate' }, 
    // { dataIndex: 'power_supply',key: 'power_supply', title: 'power_supply' }, 
    // { dataIndex: 'power_rate',key: 'power_rate', title: 'power_rate' }, 
    // { dataIndex: 'gas_supply',key: 'gas_supply', title: 'gas_supply' }, 
    // { dataIndex: 'gas_rate',key: 'gas_rate', title: 'gas_rate' }, 
    { dataIndex: 'total_units',key: 'total_units', title: 'تعداد واحد ها' }, 
    // { dataIndex: 'used_units',key: 'used_units', title: 'used_units' }, 
    // { dataIndex: 'used_number',key: 'used_number', title: 'used_number' }, 
    // { dataIndex: 'location',key: 'location', title: 'location' }, 
    // { dataIndex: 'coordinate_e',key: 'coordinate_e', title: 'coordinate_e' }, 
    // {dataIndex: 'coordinate_n',key: 'coordinate_n', title: 'coordinate_n' }, 
    // { dataIndex: 'file_dxf',key: 'file_dxf', title: 'file_dxf' }, 
    // { dataIndex: 'file_kmz',key: 'file_kmz', title: 'file_kmz' },
];
export const storeIndex = "Town";
export const pageHeder = 'شناسنامه شهرک ها';

export const emptyItem = {
    title : '' ,province_id : '' ,city : '' ,gross_area : '' ,pure_area : '' ,inityear : '' ,activity_type_id : '' ,ownership_type_id : '' ,water_supply_id : '' ,water_rate : '' ,power_supply_id : '' ,power_rate : '' ,gas_supply_id : '' ,gas_rate : '' ,total_units : '' ,used_units : '' ,used_number : '' ,location_id : '' ,coordinate_e : '' ,coordinate_n : '' ,file_dxf : '' ,file_kmz : '' ,f_file_dxf : '' ,f_file_kmz : ''
};