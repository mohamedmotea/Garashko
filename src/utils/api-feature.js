
import paginationFun from './pagination.js';
class ApiFeatures {
  constructor(query,mongooseQuery){
    this.query = query;
    this.mongooseQuery = mongooseQuery;
  }
  pagination({page,size}){
    const {limit , skip} = paginationFun({page,size});
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
    return this
  }
  search(search){
   let searchQuery = {}
   if(search.city) searchQuery["location.city"] =  {$regex:search.city,$options:'i'}
   if(search.state) searchQuery["location.state"] =  {$regex:search.state,$options:'i'}
   if(search.address) searchQuery["location.address"] =  {$regex:search.address,$options:'i'}
   if(search.name) searchQuery.parking_name = {$regex:search.name,$options:'i'}
   if(search.userName) searchQuery.userName = {$regex:search.userName,$options:'i'}
   if(search.phone) searchQuery.phoneNumber = {$regex:search.phone}
   
   this.mongooseQuery = this.mongooseQuery.find(searchQuery)
   return this;
  }
}

export default ApiFeatures;