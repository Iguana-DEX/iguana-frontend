const stablecoins = [
  'USDT',
  'USDC',
  'BUSD',
  'USDP',
  'LUSD',
  'RAI',
  'DAI',
  'HAY',
];

export function getActiveClassName<T>(state: T, classes: [T, string][]) {
  return (classes.find(_class => _class[0] === state) || [])[1] || '';
}

// HELPER FUNCTION
export const DecimalPrecision = (function () {
  if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
  }
  if (Math.sign === undefined) {
    Math.sign = function (x) {
      return (x > 0) - (x < 0) || +x;
    };
  }
  return {
    // Decimal round (half away from zero)
    round: function (num, decimalPlaces) {
      const p = Math.pow(10, decimalPlaces || 0);
      const n = num * p * (1 + Number.EPSILON);
      return Math.round(n) / p;
    },
    // Decimal ceil
    ceil: function (num, decimalPlaces) {
      const p = Math.pow(10, decimalPlaces || 0);
      const n = num * p * (1 - Math.sign(num) * Number.EPSILON);
      return Math.ceil(n) / p;
    },
    // Decimal floor
    floor: function (num, decimalPlaces) {
      const p = Math.pow(10, decimalPlaces || 0);
      const n = num * p * (1 + Math.sign(num) * Number.EPSILON);
      return Math.floor(n) / p;
    },
    // Decimal trunc
    trunc: function (num, decimalPlaces) {
      return (num < 0 ? this.ceil : this.floor)(num, decimalPlaces);
    },
    // Format using fixed-point notation
    toFixed: function (num, decimalPlaces) {
      return this.round(num, decimalPlaces).toFixed(decimalPlaces);
    },
  };
})();

export function formatBio(dollarValue) {
  dollarValue /= 1e9;
  if (dollarValue <= 0) return '-';
  return '$' + Math.round(dollarValue) + ' bn';
}

export function formatCoinChange(change) {
  change = Math.round(change * 10) / 10;
  const formattedChange = change.toString() + '%';

  return formattedChange;
}

export function formatAmount(num: number) {
  if (num > 1000000) {
    return DecimalPrecision.round(num / 1e6, 1).toString() + 'm';
  }
  if (num > 2000) {
    return Math.round(num / 1e3).toString() + 'k';
  }

  return num;
}

export function getTimeLeft(dateTime) {
  const now = Math.round(Date.now() / 1e3);
  const timeDiffSecs = Math.abs(dateTime - now);

  const timeDiffDays = timeDiffSecs / (60 * 60 * 24);
  const wholeDays = Math.trunc(timeDiffDays);

  if (wholeDays > 3) {
    return wholeDays + ' days';
  }

  const hours = (timeDiffDays - wholeDays) * 24;
  const wholeHours = Math.trunc(hours);

  if (wholeDays > 1) {
    if (wholeHours > 1) {
      return wholeDays + ' days and ' + wholeHours + ' hours';
    } else if (wholeHours == 1) {
      return wholeDays + ' days and 1 hour';
    } else {
      return wholeDays + ' days';
    }
  }

  if (wholeDays == 1) {
    if (wholeHours > 1) {
      return '1 day day and ' + wholeHours + ' hours';
    } else if (wholeHours == 1) {
      return '1 day and 1 hour';
    } else {
      return '1 day';
    }
  }

  const mins = (hours - wholeHours) * 60;
  const wholeMins = Math.trunc(mins);

  if (wholeHours > 1) {
    if (wholeMins > 1) {
      return wholeHours + ' hours and ' + wholeMins + ' minutes';
    } else if (wholeMins == 1) {
      return wholeHours + ' hours and 1 minute';
    } else {
      return wholeHours + ' hours';
    }
  }

  if (wholeHours == 1) {
    if (wholeMins > 1) {
      return '1 hour and ' + wholeMins + ' minutes';
    } else if (wholeMins == 1) {
      return '1 hour and 1 minute';
    } else {
      return '1 hour';
    }
  }

  if (wholeMins > 1) {
    return Math.round(mins) + ' minutes';
  } else if (mins >= 1) {
    return '1 minute';
  } else {
    return 'less than 1 minute';
  }
}

export function isStablecoin(symbol: string): boolean {
  return stablecoins.includes(symbol);
}
