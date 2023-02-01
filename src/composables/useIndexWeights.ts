import Papa from 'papaparse';

export const fetchCsv = async (f: RequestInfo | URL) => {
  const response = await fetch(f);

  if (response.body == null) {
    console.log('null response from fetchCsv for index logic calc.');
    return;
  }
  const reader = response.body.getReader();
  const result = await reader.read(); // raw array
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value); // the csv text
  const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
  //   const dates = results.meta.fields;
  const rows = results.data;
  return rows;
};

{
  /* 
 const dates = results.meta.fields.slice(1, results.meta.fields.length);
  const rows = results.data.slice(0, results.data.length - 1);

*/
}

export const build_colors = function (start, end, n) {
  //Distance between each color
  const steps = [
    (end[0] - start[0]) / n,
    (end[1] - start[1]) / n,
    (end[2] - start[2]) / n,
  ];

  //Build array of colors
  const colors = [start];
  for (let ii = 0; ii < n - 1; ++ii) {
    colors.push([
      Math.floor(colors[ii][0] + steps[0]),
      Math.floor(colors[ii][1] + steps[1]),
      Math.floor(colors[ii][2] + steps[2]),
    ]);
  }
  colors.push(end);

  return colors;
};
