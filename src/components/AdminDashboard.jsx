import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [electionName, setElectionName] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [message, setMessage] = useState('');

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

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/election', { name: electionName }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Election created successfully!');
      setElectionName('');
      fetchElections(); // Refresh the elections list
    } catch (error) {
      setMessage('Failed to create election: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  // Updated AdminDashboard
  const handleAddCandidate = async (e) => {
   e.preventDefault();
   if (!selectedElectionId) {
    setMessage("Please select an election first.");
    return;
   }
  
   try {
    const response = await axios.post('/api/election/candidate', { electionId: selectedElectionId, candidateName }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setMessage('Candidate added successfully!');
    setCandidateName('');
    fetchElections(); // Refresh the elections list
    } catch (error) {
    setMessage('Failed to add candidate: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  const handleEndElection = async (electionId) => {
    try {
      await axios.put(`/api/election/${electionId}/end`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Election ended successfully!');
      fetchElections(); // Refresh the elections list
    } catch (error) {
      setMessage('Failed to end election: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}
      
      <h3>Create Election</h3>
      <form onSubmit={handleCreateElection}>
        <input
          type="text"
          placeholder="Election Name"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
          required
        />
        <button type="submit">Create Election</button>
      </form>

      <h3>Add Candidate to Election</h3>
      <form onSubmit={handleAddCandidate}>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          required
        >
          <option value="" disabled>Select Election</option>
          {elections.map((election) => (
            <option key={election._id} value={election._id}>{election.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          required
        />
        <button type="submit">Add Candidate</button>
      </form>

      <h3>Current Elections</h3>
      <ul>
        {elections.map((election) => (
          <li key={election._id}>
            {election.name} 
            {election.isActive ? (
              <button onClick={() => handleEndElection(election._id)}>End Election</button>
            ) : (
              <span> (Ended)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
