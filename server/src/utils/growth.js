export const calculateGrowth = (current,previous) =>{
    if(previous == 0) return null;
    return Number((((current - previous) / previous) * 100).toFixed(2))
};