export function formatCurrency(number: number) {
    if (isNaN(number)) {
      console.log(number)
      return 'Số không hợp lệ';
    }
    const numString = number.toString();
    const formattedString = numString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
    return formattedString;
  }
  