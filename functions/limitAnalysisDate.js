import getDatesBetween  from "./getDatesBetween.js"


const limitAnalysisDate = ({ documents, field = 'createdAt', subField = null, date }) => {
  const datesBetween =  getDatesBetween();
  let newDoc = {}
  datesBetween.map((dateItem) => {
    const label = dateItem.split("T")[0];
    const count = (documents.filter(item => item.createdAt.toISOString().split("T")[0] === label)).length
    newDoc[label] = count
  })
  const labels = Object.keys(newDoc)
  const data = Object.values(newDoc)
  return {
    labels,
    data
  }
}

export default limitAnalysisDate