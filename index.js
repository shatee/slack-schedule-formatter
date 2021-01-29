const sub = require('date-fns/sub');
const add = require('date-fns/add');
const set = require('date-fns/set');
const dateFnsFormat = require('date-fns/format');
const differenceInHours = require('date-fns/differenceInHours');

const format = (schedule, options) => {
  const {
    currentTime,
    beforeHours,
    afterHours
  } = {
    currentTime: new Date(),
    beforeHours: 1,
    afterHours: 1,
    ...options
  };

  const startTime = sub(
    set(
      currentTime,
      {
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      }
    ),
    {
      hours: beforeHours
    }
  );

  const endTime = add(startTime, {
    hours: beforeHours + 1 + afterHours
  });

  const timelines = createTimelines(schedule, currentTime, startTime, endTime);
  let message = renderHeader(startTime, endTime, currentTime);
  timelines.forEach(({ icon, timeline }) => {
    timeline.forEach((events, i) => {
      let currentPos = 0;
      let currentWidth = 0;
      message += `\n${i === 0 ? `${icon} > ` : '          '}`
      events.forEach(({ title, offset ,size }) => {
        const upperWidth = (offset + size) * 35;
        const [blank, blankWidth] = renderBlank((offset - currentPos) * 35);
        const [item, itemWidth] = renderItem(title, upperWidth - currentWidth - blankWidth);
        message += `${blank}${item}`;
        currentPos = offset + size;
        currentWidth += blankWidth + itemWidth;
      });
    });
  }, renderHeader(startTime, endTime));
  return message;
};

const renderHeader = (startTime, endTime, currentTime) => {
  let times = [];
  for (let t = startTime; t < endTime; t = add(t, { hours: 1 })) {
    let blank = ''.padEnd(25, ' ');
    if (t <= currentTime && currentTime < add(t, { hours: 1 })) {
      const cur = Math.floor(currentTime.getMinutes() * 25 / 60);
      blank = '.'.padStart(cur, ' ').padEnd(25, ' ')
    }
    times.push(`${blank.substr(0, 13)}${dateFnsFormat(t, 'HH:00')}${blank.substr(13)}`);
  }
  return `|　　|${times.join('|')}|`;
};

const renderItem = (title, maxWidth) => {
  const [title_, width] = slice(title.replace(/:[^:]+:/g, ''), maxWidth - 14);
  return [`\`${title_}\` `, width + 14];
};

const slice = (str, maxWidth) => {
  let result = '';
  let width = 0;
  str.split('').find((char) => {
    const isWide = isWideChar(char);
    const charWidth = isWide ? 12 : 7;
    if (isWide && maxWidth - width < 12 && maxWidth - width >= 7) {
      result += '.';
      width += 7;
      return true;
    }
    result += char;
    width += charWidth
    return maxWidth - width < 7;
  });
  // for (let remainWidth = maxWidth - width; remainWidth >= 7; remainWidth = maxWidth - width) {
  //   if (remainWidth >= 14) {
  //     result += '  ';
  //     width += 14;
  //   } else if (remainWidth >= 12) {
  //     result += '　';
  //     width += 12;
  //   } else {
  //     result += ' ';
  //     width += 7;
  //   }
  // }
  const remainNum = Math.floor((maxWidth + 2 - width) / 7);
  result += ''.padEnd(remainNum, ' ');
  width += remainNum * 7;

  // when last char is space, sometimes break inline code block. and replace to dot.
  if (result.slice(-1) === ' ') {
    result = `${result.slice(0, result.length - 1)}.`;
  }

  return [result, width];
}

const isWideChar = (char) => {
  return /^[^\x01-\x7E\xA1-\xDF]$/.test(char);
}

const renderBlank = (maxWidth) => {
  // const num = Math.floor((maxWidth + 1) / 4);
  // return [''.padEnd(num, ' '), num * 4];
  const num = Math.floor((maxWidth + 1) / 3.8);
  return [''.padEnd(num, ' '), num * 3.8];
}

const createTimelines = (schedule, currentTime, startTime, endTime) => {
  const endOfPos = (endTime.getHours() - startTime.getHours()) * 4;
  return schedule.map(({ icon, events }) => {
    icon = `:${icon.replace(/:/g, '')}:`;
    const timelineAllowDuplicated = events.reduce((timeline, { title, start, end}) => {
      if (typeof start === 'string') start = new Date(start);
      if (typeof end === 'string') end = new Date(end);

      if (end < startTime || endTime < start || differenceInHours(end, start) >= 24) return timeline;

      const offset = Math.max((start.getHours() - startTime.getHours()) * 4 + Math.floor(start.getMinutes() / 15), 0);
      const size = Math.min(
        (end.getHours() - startTime.getHours()) * 4 + Math.floor(end.getMinutes() / 15) - offset,
        endOfPos - offset
      );
      if (size <= 0) return timeline;

      const item = {
        title,
        start,
        end,
        offset,
        size
      };

      return [
        ...timeline,
        item
      ];
    }, []);

    return { icon, timeline: divideTimeline(timelineAllowDuplicated) };
  });
};

const divideTimeline = (timelineAllowDuplicated) => {
  return timelineAllowDuplicated.reduce((divided, item) => {
    const isConflict = !divided.find((t) => {
      if (!checkConflict(t, item)) {
        t.push(item);
        return true;
      }
    });
    return isConflict ? [...divided, [item]] : divided;
  }, [[]]);
};

const checkConflict = (timeline, item) => {
  return !timeline.every((current) => {
    return item.offset + item.size <= current.offset || current.offset + current.size <= item.offset;
  });
};

module.exports.format = format;
module.exports.createTimelines = createTimelines;
