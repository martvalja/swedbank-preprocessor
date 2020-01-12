const fileUploadField = document.getElementById("file-upload");

const readSourceAndProcess = () => {
  const files = fileUploadField.files;
  const fileReader = new FileReader();
  fileReader.onload = (e) => processFile(e.target.result);
  fileReader.readAsText(files[0]);
};

const processFile = (file) => {
  const lines = file.split('\n').splice(1);
  const items = lines.map(parseLine).filter((item) => !!item.id);
  const newLines = items.map(itemToCsvLine);
  let newFile = "Identifier;Date;Sum;Memo\u2029\u2028";
  newFile += newLines.join('\u2029\u2028');
  download(newFile);
};

const parseLine = (line) => {
  const items = line.split(";");
  const cleanedItems = items.map((item) => item.substring(1, item.length - 1));
  const sum = Number(cleanedItems[5].replace(",", "."));
  const shouldNegate = cleanedItems[7] === 'K';
  return {
    id: cleanedItems[8],
    date: cleanedItems[2],
    memo: cleanedItems[4],
    sum: shouldNegate ? sum : -sum,
  };
};

const itemToCsvLine = (item) => `${item.id};${item.date};${item.sum};${item.memo}`;

const download = (file) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = `data:text/csv;charset=utf-8,${file}`;
  downloadLink.download = "statement-processed.csv";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

fileUploadField.addEventListener('change', readSourceAndProcess);
