const moment = require('moment');
const uuid = require('uuid');

class Voters {
	/*
	*class constructor
	*@params {Object} data 
	*/
	constructor() {
		this.voters = [];
	}
	
	/**
   * 
   * @returns {object} voter object
   */
  add(data) {
    const newVoter = {
      voter_id: uuid.v4(),
      finger_print: data.finger_print || '',
      accredited: data.accredited || false,
      voted: data.voted || false,
      modifiedDate: moment.now()
    };
    this.voters.push(newVoter);
    return newVoter;
  }  
	  
  /**
   * 
   * @param {uuid} voter_tag
   * @returns {object} voter object
   */
  findOne(finger_print) {
    return this.voters.find(voter => voter.finger_print === finger_print);
  }

  /**
   * @returns {object} returns total voters
   */
  findTotalVoters() {
    return this.voters.length
  }

  /*
  find total accredited voters
  */
  findAccredited(){
    let accredited = 0
    this.voters.forEach(item  => {
      if (item.accredited === true) accredited++
    })
    return accredited
  }

  /**
   * 
   * @param {uuid} id
   * @param {object} data 
   */
  update(voter_tag , value) {
    const vote_tag = this.findOne(voter_tag);
    const index = this.voters.indexOf(vote_tag);
    const voter = this.voters[index]
    // update voter data
    if(value === 'accredited'){
      if (voter.accredited === true) {
        return '' //Error, voter has already been accredited!
      }
      voter.accredited = true  
    }
    
    if (value === 'voted') {
      if (voter.accredited !== true) {
        return '' //Error, voter has not been accredited!
      }
      if (voter.voted === true) {
        return 'voted' //Error, voter has already voted!
      }
      voter.voted = true  
    }
    
    this.voters[index].modifiedDate = moment.now()
    return this.voters[index];
  }

  /**
   * 
   * @param {uuid} id 
   */
  delete(voter_tag) {
    const voter = this.findOne(voter_tag);
    const index = this.voters.indexOf(reflection);
    this.voters.splice(index, 1);
    return {};
  }

  /**
   * 
   * @param {uuid} id 
   */
  deleteAll() {
    //clear the voters' array
    this.voters.length = 0 ;
    return 1;
  }

}


module.exports = new Voters()