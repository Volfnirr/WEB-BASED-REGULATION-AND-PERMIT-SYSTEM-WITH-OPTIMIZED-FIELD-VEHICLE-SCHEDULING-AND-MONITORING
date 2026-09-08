// Timestamptz

export function getLast7DaysRange() {
  const OFFSET_MS = 8 * 60 * 60 * 1000;

  const nowUtc = new Date();
  const manilaNow = new Date(nowUtc.getTime() + OFFSET_MS);

  const endManila = new Date(manilaNow);
  endManila.setUTCDate(manilaNow.getUTCDate() + 1);
  endManila.setUTCHours(0, 0, 0, 0);

  const startManila = new Date(endManila);
  startManila.setUTCDate(endManila.getUTCDate() - 7);

  const start = new Date(startManila.getTime() - OFFSET_MS);
  const end = new Date(endManila.getTime() - OFFSET_MS);

  return { start, end };
}

// Timestamptz

export function getNext7DaysRange() {
  const OFFSET_MS = 8 * 60 * 60 * 1000;

  const nowUtc = new Date();
  const manilaNow = new Date(nowUtc.getTime() + OFFSET_MS);

  const startManila = new Date(manilaNow);
  startManila.setUTCHours(0, 0, 0, 0);

  const endManila = new Date(startManila);
  endManila.setUTCDate(startManila.getUTCDate() + 7);

  const start = new Date(startManila.getTime() - OFFSET_MS);
  const end = new Date(endManila.getTime() - OFFSET_MS);

  return { start, end };
}

// // Timestamptz

export function getLast30DaysRange() {
  const OFFSET_MS = 8 * 60 * 60 * 1000;

  const nowUtc = new Date();
  const manilaNow = new Date(nowUtc.getTime() + OFFSET_MS);

  const endManila = new Date(manilaNow);
  endManila.setUTCDate(manilaNow.getUTCDate() + 1);
  endManila.setUTCHours(0, 0, 0, 0);

  const startManila = new Date(endManila);
  startManila.setUTCDate(endManila.getUTCDate() - 30);

  const start = new Date(startManila.getTime() - OFFSET_MS);
  const end = new Date(endManila.getTime() - OFFSET_MS);

  return { start, end };
}

// // Timestamptz

export function getNext30DaysRange() {
  const OFFSET_MS = 8 * 60 * 60 * 1000;

  const nowUtc = new Date();
  const manilaNow = new Date(nowUtc.getTime() + OFFSET_MS);

  const startManila = new Date(manilaNow);
  startManila.setUTCHours(0, 0, 0, 0);

  const endManila = new Date(startManila);
  endManila.setUTCDate(startManila.getUTCDate() + 30);

  const start = new Date(startManila.getTime() - OFFSET_MS);
  const end = new Date(endManila.getTime() - OFFSET_MS);

  return { start, end };
}

// Timestamptz

export function getTodayRange() {
  const OFFSET_MS = 8 * 60 * 60 * 1000;

  const nowUtc = new Date();
  const manilaNow = new Date(nowUtc.getTime() + OFFSET_MS);

  const startManila = new Date(manilaNow);
  startManila.setUTCHours(0, 0, 0, 0);

  const endManila = new Date(startManila);
  endManila.setUTCDate(startManila.getUTCDate() + 1);

  const start = new Date(startManila.getTime() - OFFSET_MS);
  const end = new Date(endManila.getTime() - OFFSET_MS);

  return { start, end };
}

function getManilaTodayAsDateOnly() {
  const OFFSET_MS = 8 * 60 * 60 * 1000;
  const nowUtc = new Date();
  const manilaNow = new Date(nowUtc.getTime() + OFFSET_MS);

  return new Date(
    Date.UTC(
      manilaNow.getUTCFullYear(),
      manilaNow.getUTCMonth(),
      manilaNow.getUTCDate(),
    ),
  );
}

// Date

export function getTodayDateOnlyRange() {
  const start = getManilaTodayAsDateOnly();
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 1);
  return { start, end };
}

// Date

export function getNext7DaysDateOnlyRange() {
  const start = getManilaTodayAsDateOnly();
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 7);
  return { start, end };
}
