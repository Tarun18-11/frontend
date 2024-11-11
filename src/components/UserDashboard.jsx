import { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get('/api/elections', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setElections(response.data.data);
    } catch (error) {
      console.error('Failed to fetch elections', error);
    }
  };

  const handleVote = async (electionId) => {
    try {
      await axios.post('/api/election/vote', { electionId, candidateId: selectedCandidateId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Vote cast successfully!');
      fetchElections(); // Refresh the elections list
      setSelectedCandidateId(''); // Reset selected candidate after voting
    } catch (error) {
      // This error message will be provided by the backend if the user has already voted
      setMessage('Failed to cast vote: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };
  

  const fetchResults = async (electionId) => {
    try {
      const response = await axios.get(`/api/results`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResults(response.data.data.find(e => e._id === electionId)); // Find specific election results
    } catch (error) {
      console.error('Failed to fetch results', error);
    }
  };

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      {message && <p className="message">{message}</p>}

      <h3>Active Elections</h3>
      <ul>
        {elections.map((election) => (
          election.isActive && (
            <li key={election._id}>
              <h4>{election.name}</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleVote(election._id);
              }}>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Candidate</option>
                  {election.candidates.map(candidate => (
                    <option key={candidate._id} value={candidate._id}>{candidate.name}</option>
                  ))}
                </select>
                <button type="submit">Vote</button>
              </form>
              <button onClick={() => fetchResults(election._id)}>See Results</button>
            </li>
          )
        ))}
      </ul>

      {results && (
        <div className="results">
          <h3>Results for {results.name}</h3>
          <ul>
            {results.candidates.map(candidate => (
              <li key={candidate._id}>
                {candidate.name}: {candidate.votes} vote(s)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
