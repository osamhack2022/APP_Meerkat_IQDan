export function cutString(inputString:string, parsePosition:number):string{
    if(inputString.length < parsePosition) return inputString;
    else return inputString.substring(parsePosition);
}
