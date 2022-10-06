/**
 * Determine whether 'value' is empty or not.
 * @param value which want to know empty or not.
 * @returns true if value is null or undefined.
 */
export function isEmpty(value: any): boolean{
  if(value === null || value === undefined) return true;
  else return false;
}


/**
 * Determine whether 'value' is empty string or not.
 * @param value which want to know.
 * @returns true if value is "".
 */
 export function isEmptyString(value: string): boolean{
  if(value === "") return true;
  else return false;
}
