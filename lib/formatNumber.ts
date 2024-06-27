//format number
const formatNumber = (num: number, option?: Intl.NumberFormatOptions) => {
  return num?.toLocaleString('en-US', option);
};

export default formatNumber;
