
import { useState, useContext, useEffect } from 'react';
import ReactRelayQueryFetcher from 'react-relay/lib/ReactRelayQueryFetcher';
import RelayContext from './RelayContext';
import { getRequest, createOperationSelector } from 'relay-runtime';


const STORE_THEN_NETWORK = 'STORE_THEN_NETWORK';

const useQuery = (query, variables, { dataFrom, cacheConfig } = {}) => {
  const { environment } = useContext(RelayContext);
  
  const [currentSnapshot, setCurrentSnapshot] = useState(null);
  const [currentError, setCurrentError] = useState(null);

  const request = getRequest(query);
  const requestCacheKey = getRequestCacheKey(request, variables);

  const handleDataChange = ({ error, snapshot }) => {
    if (currentSnapshot == snapshot && currentError == error) {
      return;
    }
    if (snapshot) {
      setCurrentSnapshot(snapshot);
      setCurrentError(null);
    } else if (error) {
      setCurrentSnapshot(null);
      setCurrentError(error);
    } else {
      setCurrentSnapshot(null);
      setCurrentError(null);
    }
  };
  
  useEffect(() => {
    const queryFetcher = new ReactRelayQueryFetcher();
    const operation = createOperationSelector(request, variables);
    
    try {
      const storeSnapshot =
        dataFrom === STORE_THEN_NETWORK
          ? queryFetcher.lookupInStore(environment, operation)
          : null;

      const querySnapshot = queryFetcher.fetch({
        cacheConfig,
        dataFrom,
        environment,
        onDataChange: handleDataChange,
        operation,
      });
      queryFetcher.setOnDataChange(handleDataChange)

      const snapshot = querySnapshot || storeSnapshot;
      if (!snapshot) {
        setCurrentSnapshot(null);
        setCurrentError(null);
      } else {
        setCurrentSnapshot(snapshot);
        setCurrentError(null);
      }
    } catch (error) {
      setCurrentSnapshot(null);
      setCurrentError(error);
    }

    return () => {
      queryFetcher.dispose();
    }
  }, 
  [requestCacheKey, environment])

  return [currentSnapshot ? currentSnapshot.data : null, currentError];
}

export default useQuery;



function getRequestCacheKey(request, variables) {
  if (request.kind === 'BatchRequest') {
    return JSON.stringify({
      id: request.requests.map(req => String(req.id || req.text)),
      variables,
    });
  } else {
    const requestID = request.id || request.text;
    return JSON.stringify({
      id: String(requestID),
      variables,
    });
  }
}