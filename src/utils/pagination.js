
const paginationFun = ({page = 1 , size = 7}) => {
  if(page < 1) page = 1
  if(size < 1) size = 7
  const limit = +size
  const skip = (+page - 1) * limit
  return {limit,skip}
}

export default paginationFun