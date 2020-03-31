// 加法函数
export const accAdd = (arg1, arg2) => {
    let r1 = 0;
    let r2 = 0;
    let m;
    let c;
  
    try {
      r1 = String(arg1).split('.')[1].length;
    } catch(e) {}
  
    try {
      r2 = String(arg2).split('.')[1].length;
    } catch(e) {}
  
    m = Math.pow(10, Math.max(r1, r2));
    arg1 = arg1 * m;
    arg2 = arg2 * m;
  
    return (arg1 + arg2) / m;
  }
  
  // 减法函数
  export const accSub = (arg1, arg2) => {
    let r1 = 0;
    let r2 = 0;
    let m;
    let c;
  
    try {
      r1 = String(arg1).split('.')[1].length;
    } catch(e) {}
  
    try {
      r2 = String(arg2).split('.')[1].length;
    } catch(e) {}
  
    m = Math.pow(10, Math.max(r1, r2));
    arg1 = arg1 * m;
    arg2 = arg2 * m;
  
    return (arg1 - arg2) / m;
  }
  
  // 乘法函数
  export const accMul = (arg1, arg2) => {
    let m = 0;
    let s1 = String(arg1);
    let s2 = String(arg2);
  
    try {
      m += s1.split('.')[1].length;
    } catch(e) {}
  
    try {
      m += s2.split('.')[1].length;
    } catch(e) {}
  
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
  }
  
  // 除法函数
  export const accDiv = (arg1, arg2) => {
    let r1 = 0;
    let r2 = 0;
    let s1 = String(arg1);
    let s2 = String(arg2);
  
    try {
      r1 = s1.split('.')[1].length;
    } catch(e) {}
  
    try {
      r2 = s2.split('.')[1].length;
    } catch(e) {}
  
    return Number(s1.replace('.', '')) / Number(s2.replace('.', '')) * Math.pow(r2 - r1);
  }