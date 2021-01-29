const { createTimelines } = require('../index');
const parseISO = require('date-fns/parseISO');

describe('createTimelines', () => {
  test('unit hours', () => {
    const timelines = createTimelines(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'HOGEHOGE',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 15:00')
            }
          ]
        }
      ],
      parseISO('2020-01-01 14:00'),
      parseISO('2020-01-01 13:00'),
      parseISO('2020-01-01 16:00')
    );

    const { icon, timeline } = timelines[0];
    expect(icon).toBe(':man:');
    expect(timeline[0][0].offset).toBe(4);
    expect(timeline[0][0].size).toBe(4);
  });

  test('unit minutes', () => {
    const timelines = createTimelines(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'HOGEHOGE',
              start: parseISO('2020-01-01 14:15'),
              end: parseISO('2020-01-01 14:45')
            }
          ]
        }
      ],
      parseISO('2020-01-01 14:00'),
      parseISO('2020-01-01 13:00'),
      parseISO('2020-01-01 16:00')
    );

    const { icon, timeline } = timelines[0];
    expect(icon).toBe(':man:');
    expect(timeline[0][0].offset).toBe(5);
    expect(timeline[0][0].size).toBe(2);
  });

  test('sequential', () => {
    const timelines = createTimelines(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'HOGEHOGE',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 15:00')
            },
            {
              title: 'FUGAFUGA',
              start: parseISO('2020-01-01 15:00'),
              end: parseISO('2020-01-01 15:30')
            }
          ]
        }
      ],
      parseISO('2020-01-01 14:00'),
      parseISO('2020-01-01 13:00'),
      parseISO('2020-01-01 16:00')
    );

    const { icon, timeline } = timelines[0];
    expect(icon).toBe(':man:');
    expect(timeline[0][0].offset).toBe(4);
    expect(timeline[0][0].size).toBe(4);
    expect(timeline[0][1].offset).toBe(8);
    expect(timeline[0][1].size).toBe(2);
  });

  test('parallel', () => {
    const timelines = createTimelines(
      [
        {
          icon: 'man',
          events: [
            {
              title: 'HOGEHOGE',
              start: parseISO('2020-01-01 14:00'),
              end: parseISO('2020-01-01 15:00')
            },
            {
              title: 'FUGAFUGA',
              start: parseISO('2020-01-01 14:45'),
              end: parseISO('2020-01-01 15:30')
            }
          ]
        }
      ],
      parseISO('2020-01-01 14:00'),
      parseISO('2020-01-01 13:00'),
      parseISO('2020-01-01 16:00')
    );

    const { icon, timeline } = timelines[0];
    expect(icon).toBe(':man:');
    expect(timeline[0][0].offset).toBe(4);
    expect(timeline[0][0].size).toBe(4);
    expect(timeline[1][0].offset).toBe(7);
    expect(timeline[1][0].size).toBe(3);
  });

  test('empty', () => {
    const timelines = createTimelines(
      [
        {
          icon: 'man',
          events: []
        }
      ],
      parseISO('2020-01-01 14:00'),
      parseISO('2020-01-01 13:00'),
      parseISO('2020-01-01 16:00')
    );

    const { icon, timeline } = timelines[0];
    expect(icon).toBe(':man:');
    expect(timeline[0]).toHaveLength(0);
  });
});

const debug = (val) => {
  console.log('[DEBUG]', JSON.stringify(val, null, 2));
};
