import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';

import { ISpace } from '@/services/interfaces/space.i.ts';
import { getSpacesByUser } from '@/services/space_services.ts';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';
import { showToast } from '@/utils/toast_helper.ts';
import { getAuth, setAuth } from '@/auth';

interface SpaceContextType {
  activeSpace: ISpace | null;
  availableSpaces: ISpace[];
  loading: boolean;
  fetchSpaces: () => void;
  handleSetActiveSpace: (spaceId: number) => void;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth, isLoading: authLoading } = useAuth(); // Get auth and loading from AuthContext
  const [availableSpaces, setAvailableSpaces] = useState<ISpace[]>([]);
  const [activeSpace, setActiveSpace] = useState<ISpace | null>(null);
  const [pagePermits, setPagePermits] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const userId = auth?.user?.userId;

  const fetchSpaces = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const spaces = await getSpacesByUser(userId);
      setAvailableSpaces(spaces);

      if (!activeSpace && spaces.length > 0) {
        if (auth) {
          const initialSpace = spaces.find(
            (space: { id: number }) => space.id === auth?.user?.spaceId
          );
          setActiveSpace(initialSpace); // Set the first space as active space
        }
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userId) {
      fetchSpaces();
    }
  }, [authLoading, userId, auth]);

  useEffect(() => {
    if (auth) {
      setActiveSpace(
        auth.user.spaceId
          ? availableSpaces.find((space) => space.id === auth.user.spaceId) || null
          : null
      );
    }
  }, [auth, availableSpaces]);

  const handleSetActiveSpace = (spaceId: number) => {
    const space = availableSpaces.find((space) => space.id === spaceId);
    setActiveSpace(space || null);

    setAuth({
      accessToken: getAuth()?.accessToken as string,
      user: {
        userId: getAuth()?.user.userId as number,
        name: getAuth()?.user.name as string,
        email: getAuth()?.user.email as string,
        role: getAuth()?.user.role as string,
        updated_at: getAuth()?.user.updated_at as string,
        created_at: getAuth()?.user.created_at as string,
        spaceId: space?.id as number,
        profileImageURL: getAuth()?.user.profileImageURL as string
      },
      refreshToken: getAuth()?.refreshToken as string
    });

    showToast('success', `Space changed to ${space?.spaceName}`, { icon: '📂' });
  };

  const contextValue = useMemo(
    () => ({ availableSpaces, loading, activeSpace, fetchSpaces, handleSetActiveSpace }),
    [availableSpaces, loading, activeSpace]
  );

  return <SpaceContext.Provider value={contextValue}>{children}</SpaceContext.Provider>;
};

export const useSpace = (): SpaceContextType => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error('useSpace must be used within a SpaceProvider');
  }
  return context;
};
