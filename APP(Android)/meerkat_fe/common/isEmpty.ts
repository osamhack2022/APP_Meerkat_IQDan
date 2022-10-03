
/**
 * Determine whether 'value' is empty or not.
 * @param value which want to know empty or not.
 * @returns true if value if null or undefined or empty string("").
 */
export default function isEmpty(value: any): boolean{
  if(value === null || value === undefined || value === "") return true;
  else return false;
}
