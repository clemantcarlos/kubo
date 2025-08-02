export default function conparator(fixedValue: number, changingValue: number) {
  const absoluteDiff = Math.abs(fixedValue - changingValue);
  
  let relativeDiff: number;
  if (fixedValue === 0) {
    relativeDiff = changingValue === 0 ? 0 : Infinity;
  } else {
    relativeDiff = ((fixedValue - changingValue) / changingValue) * 100;
  }
  return { absoluteDiff, relativeDiff };
}