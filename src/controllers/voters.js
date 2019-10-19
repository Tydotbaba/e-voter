const VoterModel = require('../models/voters');
const party = require('../models/party');

const Voters = {
  /**
   * 
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  addVoter(req, res) {
    const register_state = req.register_state
    if(register_state === 'register_in_session'){
      //const voter_tag = req.body.voter_tag
      const finger_print = req.body.finger_print
      //console.log('voter_tag: ', voter_tag)
      console.log('finger_print: ', finger_print)
      if (typeof finger_print === 'undefined') { 
        console.log('empty finger print field.')
        return res.send({'Error': 'Finger print field is required'})
      }
      //check if voter has already registered
      const voter_exits = VoterModel.findOne(finger_print);
      if (voter_exits) {
        return res.status(200).send({'message': 'voter has already registered!'});
      }
      const voter = VoterModel.add(req.body);
      const data = {
        'success': 'Successfully register an eligible voter.',
        'voter detail': voter
      }
      console.log('Successfully register an eligible voter.')
      return res.send(data);
    }
    else if(register_state === 'register_has_finished'){
      const data = {
        'Error': 'register process has finished!'
      }
      return res.json(data);
    }

    else if(register_state === 'register_has_not_started'){
      const data = {
        'Error': 'register process has not started!'
      }
      return res.json(data);
    }    
  },
  /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @returns {object} reflections array
   */
  getTotalVoters(req, res) {
    const total_voter = VoterModel.findTotalVoters();
    console.log(total_voter)
    return res.json({'total_voter': total_voter})
  },
  /**
   * 
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object
   */
  getOne(req, res) {
    const finger_print = req.params.id
    console.log('finger_print: ' + finger_print)
    const voter = VoterModel.findOne(finger_print);
    if (!voter) {
      return res.status(200).send({'message': 'voter not found'});
    }
    return res.status(200).json(voter);
  },
  /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated voter
   */
  update(req, res) {
    //const voter_tag = req.params.id
    const finger_print = req.body.finger_print
    const voter = VoterModel.findOne(finger_print);
    const updateAccreditParam = req.body.accredited
    const updateVotedParam = req.body.voted
    const partyVoted = req.body.party
    
    //check query parameters if empty
    if(!updateAccreditParam && !updateVotedParam){
      return res.status(200).send({'Error': 'No update parameter found'});
    }

    //update voter accredition
    if(updateAccreditParam === true){
      const accredit_state = req.accredit_state
      if(accredit_state === 'accredit_in_session'){
        if (!voter) {
          const data = {
            "message": "Error, voter not found.",
            "finger_print": finger_print
          }
          return res.status(200).json(data);
          //return res.status(200).send({'Error': 'voter not found'});
        }
        if (voter.finger_print !== finger_print) {
          return res.status(200).json({
            'Error': 'voter tag and finger print did not match!'
          })
        }
        let value = 'accredited'
        let update = VoterModel.update(finger_print, value)
        if (!update) {
          return res.status(200).json({
            'Error': 'Voter has already been accredited!'
          })
        }
        const responseData = {
           'voter': update,
           'message': 'You have been accredited successfully!'
         
        }
        return res.status(200).send(responseData);
      }

      else if(accredit_state === 'accredit_has_finished'){
        const data = {
          'Error': 'accredit process has finished!'
        }
        return res.json(data);
      }

      else if(accredit_state === 'accredit_has_not_started'){
        const data = {
          'Error': 'accredit process has not started!'
        }
        return res.json(data);
      } 
    }

    //update voter vote
    if(updateVotedParam === true){
      const vote_state = req.vote_state
      if(vote_state === 'vote_in_session'){
        if (!voter) {
          const data = {
            "message": "Error, voter not found.",
            "finger_print": finger_print
          }
          return res.status(200).json(data);
          //return res.status(200).send({'Error': 'voter not found'});
        }
        if (voter.finger_print !== finger_print) {
          return res.status(200).json({
            'Error': 'voter tag and finger print did not match!'
          })
        }
        let value = 'voted'
        let update = VoterModel.update(finger_print, value)
        if (!update) {
          return res.status(200).json({
            'Error': 'Voter has not been accredited!'
          })
        }

        if (update === 'voted') {
          return res.status(200).json({
            'Error': 'You have already voted!'
          })
        }
        const party_to_vote_for = party.findIndex(obj => {
          return obj.party_accronym === partyVoted
        })

        console.log(party_to_vote_for)
        party[party_to_vote_for].vote_count++

        console.log(party[party_to_vote_for])

        const responseData = {
           'voter': update,
           'message': 'You have voted successfully!'
         
        }
        return res.status(200).send(responseData);
      }

      else if(vote_state === 'vote_has_finished'){
        const data = {
          'Error': 'vote process has finished!'
        }
        return res.json(data);
      }

      else if(vote_state === 'vote_has_not_started'){
        const data = {
          'Error': 'vote process has not started!'
        }
        return res.json(data);
      } 
    }
  },
  /**
   * 
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
  delete(req, res) {
    const voter = VoterModel.findOne(req.params.voter_tag);
    if (!voter) {
      return res.sendStatus(404).send({'message': 'voter not found'});
    }
    const ref = VoterModel.delete(req.params.voter_tag);
    return res.sendStatus(204).send(ref);
  },

  deleteAll(req, res){
    const voter = VoterModel.deleteAll();
    if(voter === 1){
      console.log('New voting session set, deleted all voter data.')
    }
    return res.redirect('/'); 
  },
}


module.exports = Voters;