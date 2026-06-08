export default function capitalize(str){
    if(str===null || str===undefined){
        return ""
    }
    return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}