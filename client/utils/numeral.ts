import numeral from 'numeral'

if (!numeral.locales.vi) {
  numeral.register('locale', 'vi', {
    delimiters: {
      thousands: ',',
      decimal: '.',
    },
    abbreviations: {
      thousand: ' nghìn',
      million: ' triệu',
      billion: ' tỷ',
      trillion: ' nghìn tỷ',
    },
    ordinal: function ordinal() {
      return '.'
    },
    currency: {
      symbol: '₫',
    },
  })
}

numeral.locale('vi')

export { numeral }
