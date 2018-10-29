
import { useState, useContext, useEffect, useMemo, useRef } from 'react';
import { createFragmentSpecResolver, getDataIDsFromObject, getFragment } from 'relay-runtime';
import RelayContext from './RelayContext';


const useResolveFragments = (props, fragments) =>  {
  const context = useContext(RelayContext);
  const { environment } = context;

  fragments = mapObject(fragments, getFragment);

  const resolver = useMemo(
    () => {
      return createFragmentSpecResolver(
        context,
        'useFragment',
        fragments,
        props,
      );
    }, 
    [environment, JSON.stringify(getDataIDsFromObject(fragments, props))]
  );

  const [data, setData] = useState(() => resolver.resolve());
  const [isLoading, setIsLoading] = useState(() => resolver.isLoading());

  const prevResolver = useRef(resolver);
  if (prevResolver.current !== resolver) {
    setData(resolver.resolve())
    setIsLoading(resolver.isLoading())
  }

  useEffect(
    () => {
      resolver.setCallback(() => {
        setData(resolver.resolve());
        setIsLoading(resolver.isLoading())
        const maybeNewData = resolver.resolve();
        if (data !== maybeNewData) {
          setData(maybeNewData);
        }
      })
      return () => {
        resolver.dispose();
      };
    }, 
    [resolver]
  );
  return { ...data, relay: { isLoading, environment } };
}

export default useResolveFragments;


function mapObject(object, callback, context) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result[name] = callback.call(context, object[name], name, object);
    }
  }
  return result;
}
