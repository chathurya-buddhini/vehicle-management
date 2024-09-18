// 
import { Parser } from 'json2csv';

// Export a function 'exportToCSV' that takes an array of data objects as input.
export const exportToCSV = (data: any[]) => {
  
  const fields = ['first_name', 'last_name', 'email', 'car_make', 'car_model', 'vin', 'manufactureDate', 'age_of_vehicle'];

 
  const parser = new Parser({ fields });

  
  return parser.parse(data);
};
