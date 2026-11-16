import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent, Enquiry, CaseStudyItem, ServiceItem, CareerOpening, CareerApplication, OwnerProfile, OwnerBlogPost } from '../types';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User, signInWithCustomToken } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../firebaseErrors';

export { INITIAL_PROJECTS, INITIAL_CONTENT, INITIAL_ENQUIRIES, INITIAL_CAREERS, INITIAL_OWNER_PROFILE, INITIAL_OWNER_BLOGS } from '../data/initialContent.ts';
import { INITIAL_PROJECTS, INITIAL_CONTENT, INITIAL_ENQUIRIES, INITIAL_CAREERS, INITIAL_OWNER_PROFILE, INITIAL_OWNER_BLOGS } from '../data/initialContent.ts';

interface CmsContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent>) => void;
  resetContent: () => void;
  // Projects Management
  addProject: (project: Omit<CaseStudyItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<CaseStudyItem>) => void;
  deleteProject: (id: string) => void;
  moveProjectUp: (index: number) => void;
  moveProjectDown: (index: number) => void;
  // Services Management
  addService: (service: Omit<ServiceItem, 'id' | 'number'> & { number?: string }) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  moveServiceUp: (index: number) => void;
  moveServiceDown: (index: number) => void;
  // Careers / Openings Management
  addCareerOpening: (opening: Omit<CareerOpening, 'id' | 'postedAt'>) => void;
  updateCareerOpening: (id: string, updated: Partial<CareerOpening>) => void;
  deleteCareerOpening: (id: string) => void;
  moveCareerOpeningUp: (index: number) => void;
  moveCareerOpeningDown: (index: number) => void;
  // Career Applications Management
  addCareerApplication: (app: Omit<CareerApplication, 'id' | 'createdAt' | 'status'>) => void;
  updateCareerApplicationStatus: (id: string, status: CareerApplication['status']) => void;
  deleteCareerApplication: (id: string) => void;
  // Owner Profile & Blog Management
  updateOwnerProfile: (profile: Partial<OwnerProfile>) => void;
  addOwnerBlog: (post: Omit<OwnerBlogPost, 'id' | 'publishedAt'> & { publishedAt?: string }) => void;
  updateOwnerBlog: (id: string, updated: Partial<OwnerBlogPost>) => void;
  deleteOwnerBlog: (id: string) => void;
  moveOwnerBlogUp: (index: number) => void;
  moveOwnerBlogDown: (index: number) => void;
  // Enquiries
  enquiries: Enquiry[];
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  deleteEnquiry: (id: string) => void;
  // Auth & Modal
  isAuthenticated: boolean;
  currentUser: User | null;
  isAuthReady: boolean;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isCmsOpen: boolean;
  openCms: () => void;
  closeCms: () => void;
}

const normalizeOwnerProfile = (
  incoming?: Partial<OwnerProfile>,
  fallback: OwnerProfile = INITIAL_OWNER_PROFILE
): OwnerProfile => {
  if (!incoming || typeof incoming !== 'object') return fallback;
  const isLegacyShortBio =
    typeof incoming.bio === 'string' &&
    incoming.bio.startsWith('Leading Brand Origin across category architecture, mathematical visual identity systems');
  const isLegacyLogoImage =
    typeof incoming.image === 'string' && incoming.image.includes('brand_origin_logo');

  return {
    name: typeof incoming.name === 'string' ? incoming.name : fallback.name,
    role: typeof incoming.role === 'string' ? incoming.role : fallback.role,
    headline: typeof incoming.headline === 'string' ? incoming.headline : fallback.headline,
    image: isLegacyLogoImage
      ? fallback.image
      : typeof incoming.image === 'string'
      ? incoming.image
      : fallback.image,
    bio: isLegacyShortBio
      ? fallback.bio
      : typeof incoming.bio === 'string'
      ? incoming.bio
      : fallback.bio,
    quote: typeof incoming.quote === 'string' ? incoming.quote : fallback.quote,
  };
};

const normalizeOwnerBlogs = (
  incoming?: OwnerBlogPost[],
  fallback: OwnerBlogPost[] = INITIAL_OWNER_BLOGS
): OwnerBlogPost[] => {
  if (!Array.isArray(incoming)) return fallback;
  const hasLegacyGenericEssay = incoming.some((post) =>
    post.title?.includes('Why Category Moats Are Built at the Origin')
  );
  if (hasLegacyGenericEssay && incoming.length === 3) {
    return fallback;
  }
  return incoming;
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const stored = localStorage.getItem('brand_origin_cms_content_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure defaults for any new keys
        return {
          ...INITIAL_CONTENT,
          ...parsed,
          header: { ...INITIAL_CONTENT.header, ...(parsed.header || {}) },
          projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_PROJECTS,
          careers: Array.isArray(parsed.careers) ? parsed.careers : INITIAL_CAREERS,
          careerApplications: Array.isArray(parsed.careerApplications) ? parsed.careerApplications : [],
          ownerProfile: normalizeOwnerProfile(parsed.ownerProfile, INITIAL_OWNER_PROFILE),
          ownerBlogs: normalizeOwnerBlogs(parsed.ownerBlogs, INITIAL_OWNER_BLOGS),
        };
      }
      return INITIAL_CONTENT;
    } catch {
      return INITIAL_CONTENT;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const stored = localStorage.getItem('brand_origin_cms_enquiries_v2');
      return stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('brand_origin_cms_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Track active local CMS edits to prevent stale polls or out-of-order network echoes from reverting user input
  const lastLocalEditAtRef = React.useRef<number>(0);
  const syncTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCmsOpenRef = React.useRef<boolean>(false);

  useEffect(() => {
    isCmsOpenRef.current = isCmsOpen;
  }, [isCmsOpen]);

  // Track Firebase Auth state & sync with Cloud SQL
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        setIsAuthenticated(true);
        try {
          sessionStorage.setItem('brand_origin_cms_auth', 'true');
          const token = await user.getIdToken();
          fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => {});
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync enquiries from Firestore ONLY when auth is ready and user is authenticated in Firebase
  useEffect(() => {
    if (!isAuthReady || !currentUser) return;
    const path = 'enquiries';
    const unsubscribe = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Enquiry[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Enquiry);
          });
          list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setEnquiries(list);
          try {
            localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(list));
          } catch (e) {
            console.error(e);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsubscribe();
  }, [isAuthReady, currentUser]);

  // Universal content synchronizer that merges remote updates into state & cache
  const applyRemoteContent = (
    remoteData: Partial<SiteContent> & { updatedAt?: string },
    options?: { fromBroadcast?: boolean }
  ) => {
    if (!remoteData || typeof remoteData !== 'object' || Object.keys(remoteData).length === 0) return;

    // Do not allow remote poll/SSE/onSnapshot echoes to overwrite active local edits in this browser tab
    if (!options?.fromBroadcast) {
      const msSinceLocalEdit = Date.now() - lastLocalEditAtRef.current;
      if (msSinceLocalEdit < 6000) {
        return;
      }
      if (isCmsOpenRef.current && lastLocalEditAtRef.current > 0) {
        return;
      }
    }

    setContent((prev) => {
      const prevUpdatedAt = (prev as any).updatedAt;
      if (
        !options?.fromBroadcast &&
        prevUpdatedAt &&
        remoteData.updatedAt &&
        remoteData.updatedAt < prevUpdatedAt
      ) {
        return prev;
      }

      const merged: SiteContent = {
        ...prev,
        ...remoteData,
        header: { ...prev.header, ...(remoteData.header || {}) },
        hero: { ...prev.hero, ...(remoteData.hero || {}) },
        idea: { ...prev.idea, ...(remoteData.idea || {}) },
        naming: { ...prev.naming, ...(remoteData.naming || {}) },
        identity: { ...prev.identity, ...(remoteData.identity || {}) },
        guideline: { ...prev.guideline, ...(remoteData.guideline || {}) },
        digital: { ...prev.digital, ...(remoteData.digital || {}) },
        performance: { ...prev.performance, ...(remoteData.performance || {}) },
        footprint: { ...prev.footprint, ...(remoteData.footprint || {}) },
        transformation: { ...prev.transformation, ...(remoteData.transformation || {}) },
        about: { ...prev.about, ...(remoteData.about || {}) },
        finalCta: { ...prev.finalCta, ...(remoteData.finalCta || {}) },
        projects: Array.isArray(remoteData.projects) ? remoteData.projects : prev.projects,
        services: Array.isArray(remoteData.services) ? remoteData.services : prev.services,
        careers: Array.isArray(remoteData.careers) ? remoteData.careers : (prev.careers || INITIAL_CAREERS),
        careerApplications: Array.isArray(remoteData.careerApplications) ? remoteData.careerApplications : (prev.careerApplications || []),
        ownerProfile: normalizeOwnerProfile(remoteData.ownerProfile, prev.ownerProfile || INITIAL_OWNER_PROFILE),
        ownerBlogs: normalizeOwnerBlogs(remoteData.ownerBlogs, prev.ownerBlogs || INITIAL_OWNER_BLOGS),
      };

      try {
        localStorage.setItem('brand_origin_cms_content_v2', JSON.stringify(merged));
      } catch (e) {
        console.error(e);
      }
      return merged;
    });
  };

  // 1. Real-time synchronization of Site Content across all browsers via Firestore onSnapshot
  useEffect(() => {
    const docRef = doc(db, 'content', 'site');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as Partial<SiteContent>;
          applyRemoteContent(remoteData);
        }
      },
      (error) => {
        console.warn('Real-time content listener status:', error.message);
      }
    );

    // Initial server fetch to hydrate immediately
    fetch('/api/content?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          applyRemoteContent(data);
        }
      })
      .catch(() => {});

    // Initial server fetch of enquiries so every browser admin has full synced lead data
    fetch('/api/enquiries?_t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setEnquiries(list);
          try {
            localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(list));
          } catch {}
        }
      })
      .catch(() => {});

    return () => unsubscribe();
  }, []);

  // 2. Real-time SSE Stream listener for instantaneous cross-browser push of Content & Enquiries
  useEffect(() => {
    if (typeof window === 'undefined' || !window.EventSource) return;
    const es = new EventSource('/api/content/stream');
    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'content_updated' && parsed.payload) {
          applyRemoteContent(parsed.payload as Partial<SiteContent>);
        } else if (parsed.type === 'enquiries_updated' && Array.isArray(parsed.payload)) {
          setEnquiries(parsed.payload);
          try {
            localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(parsed.payload));
          } catch {}
        }
      } catch {
        // heartbeat or comment ping
      }
    };
    return () => es.close();
  }, []);

  // 3. Fallback active polling every 3.5s to guarantee 100% cross-browser reflection of content & enquiries
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Do not poll site content while admin is actively editing inside the CMS modal
      if (!isCmsOpenRef.current && Date.now() - lastLocalEditAtRef.current >= 6000) {
        fetch(`/api/content?_t=${Date.now()}`, { cache: 'no-store' })
          .then((res) => res.json())
          .then((data) => {
            if (data && typeof data === 'object' && Object.keys(data).length > 0) {
              applyRemoteContent(data);
            }
          })
          .catch(() => {});
      }

      if (isAuthenticated) {
        fetch(`/api/enquiries?_t=${Date.now()}`, { cache: 'no-store' })
          .then((res) => res.json())
          .then((list) => {
            if (Array.isArray(list) && list.length > 0) {
              setEnquiries(list);
              try {
                localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(list));
              } catch {}
            }
          })
          .catch(() => {});
      }
    }, 3500);

    return () => clearInterval(pollInterval);
  }, [isAuthenticated]);

  // BroadcastChannel listener for instantaneous multi-tab sync in the same browser
  useEffect(() => {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    const contentChannel = new BroadcastChannel('brand_origin_content_sync');
    contentChannel.onmessage = (event) => {
      if (event.data && typeof event.data === 'object') {
        applyRemoteContent(event.data, { fromBroadcast: true });
      }
    };

    const enquiriesChannel = new BroadcastChannel('brand_origin_enquiries_sync');
    enquiriesChannel.onmessage = (event) => {
      if (event.data && Array.isArray(event.data)) {
        setEnquiries(event.data);
      }
    };

    return () => {
      contentChannel.close();
      enquiriesChannel.close();
    };
  }, []);

  // Helper to persist content changes and propagate to all browsers
  const persistAndSyncContent = (updatedContent: SiteContent) => {
    const nowIso = new Date().toISOString();
    lastLocalEditAtRef.current = Date.now();
    const stampedContent: SiteContent & { updatedAt?: string } = {
      ...updatedContent,
      updatedAt: nowIso,
    };

    setContent(stampedContent);
    try {
      localStorage.setItem('brand_origin_cms_content_v2', JSON.stringify(stampedContent));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    // 1. Instant sync across tabs in the same browser
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      try {
        const channel = new BroadcastChannel('brand_origin_content_sync');
        channel.postMessage(stampedContent);
        channel.close();
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    // Debounce remote network persistence by 250ms so rapid typing doesn't create out-of-order network race conditions
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(() => {
      lastLocalEditAtRef.current = Date.now();
      // 2. Persist to Firestore directly if admin authenticated
      if (currentUser) {
        setDoc(
          doc(db, 'content', 'site'),
          {
            ...stampedContent,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => {
          console.warn('Direct Firestore content sync notice:', err);
        });
      }

      // 3. Persist to backend /api/content (updates memory cache, disk, Firestore via Admin SDK, and Cloud SQL)
      fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stampedContent),
      }).catch((e) => {
        console.warn('API content sync error:', e);
      });
    }, 250);
  };

  const updateContent = (newFields: Partial<SiteContent>) => {
    setContent((prev) => {
      const updated: SiteContent = {
        ...prev,
        ...newFields,
        header: { ...prev.header, ...(newFields.header || {}) },
      };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const resetContent = () => {
    persistAndSyncContent(INITIAL_CONTENT);
  };

  // Projects CRUD & Reordering with functional state updates
  const addProject = (projectData: Omit<CaseStudyItem, 'id'>) => {
    const newProj: CaseStudyItem = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    setContent((prev) => {
      const updatedProjects = [newProj, ...(prev.projects || [])];
      const updated: SiteContent = { ...prev, projects: updatedProjects };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const updateProject = (id: string, updatedFields: Partial<CaseStudyItem>) => {
    setContent((prev) => {
      const updatedProjects = (prev.projects || []).map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      const updated: SiteContent = { ...prev, projects: updatedProjects };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const deleteProject = (id: string) => {
    setContent((prev) => {
      const updatedProjects = (prev.projects || []).filter((p) => p.id !== id);
      const updated: SiteContent = { ...prev, projects: updatedProjects };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveProjectUp = (index: number) => {
    if (index <= 0) return;
    setContent((prev) => {
      const current = [...(prev.projects || [])];
      if (index <= 0 || index >= current.length) return prev;
      const temp = current[index - 1];
      current[index - 1] = current[index];
      current[index] = temp;
      const updated: SiteContent = { ...prev, projects: current };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveProjectDown = (index: number) => {
    setContent((prev) => {
      const current = [...(prev.projects || [])];
      if (index < 0 || index >= current.length - 1) return prev;
      const temp = current[index + 1];
      current[index + 1] = current[index];
      current[index] = temp;
      const updated: SiteContent = { ...prev, projects: current };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  // Services CRUD & Reordering
  const addService = (serviceData: Omit<ServiceItem, 'id' | 'number'> & { number?: string }) => {
    setContent((prev) => {
      const currentServices = prev.services || [];
      const newNum = serviceData.number || String(currentServices.length + 1).padStart(2, '0');
      const newSrv: ServiceItem = {
        ...serviceData,
        id: `service-${Date.now()}`,
        number: newNum,
        deliverables: serviceData.deliverables || [],
      };
      const updatedServices = [...currentServices, newSrv];
      const updated: SiteContent = { ...prev, services: updatedServices };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const updateService = (id: string, updatedFields: Partial<ServiceItem>) => {
    setContent((prev) => {
      const updatedServices = (prev.services || []).map((s) =>
        s.id === id ? { ...s, ...updatedFields } : s
      );
      const updated: SiteContent = { ...prev, services: updatedServices };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const deleteService = (id: string) => {
    setContent((prev) => {
      const filtered = (prev.services || []).filter((s) => s.id !== id);
      // Automatically renumber sequentially
      const renumbered = filtered.map((s, idx) => ({
        ...s,
        number: String(idx + 1).padStart(2, '0'),
      }));
      const updated: SiteContent = { ...prev, services: renumbered };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveServiceUp = (index: number) => {
    if (index <= 0) return;
    setContent((prev) => {
      const current = [...(prev.services || [])];
      if (index <= 0 || index >= current.length) return prev;
      const temp = current[index - 1];
      current[index - 1] = current[index];
      current[index] = temp;
      const renumbered = current.map((s, idx) => ({
        ...s,
        number: String(idx + 1).padStart(2, '0'),
      }));
      const updated: SiteContent = { ...prev, services: renumbered };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveServiceDown = (index: number) => {
    setContent((prev) => {
      const current = [...(prev.services || [])];
      if (index < 0 || index >= current.length - 1) return prev;
      const temp = current[index + 1];
      current[index + 1] = current[index];
      current[index] = temp;
      const renumbered = current.map((s, idx) => ({
        ...s,
        number: String(idx + 1).padStart(2, '0'),
      }));
      const updated: SiteContent = { ...prev, services: renumbered };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  // Careers / Openings CRUD & Reordering
  const addCareerOpening = (openingData: Omit<CareerOpening, 'id' | 'postedAt'>) => {
    const newOpening: CareerOpening = {
      ...openingData,
      id: `career-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      responsibilities: openingData.responsibilities || [],
      requirements: openingData.requirements || [],
    };
    setContent((prev) => {
      const updatedCareers = [newOpening, ...(prev.careers || INITIAL_CAREERS)];
      const updated: SiteContent = { ...prev, careers: updatedCareers };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const updateCareerOpening = (id: string, updatedFields: Partial<CareerOpening>) => {
    setContent((prev) => {
      const updatedCareers = (prev.careers || INITIAL_CAREERS).map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c
      );
      const updated: SiteContent = { ...prev, careers: updatedCareers };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const deleteCareerOpening = (id: string) => {
    setContent((prev) => {
      const updatedCareers = (prev.careers || INITIAL_CAREERS).filter((c) => c.id !== id);
      const updated: SiteContent = { ...prev, careers: updatedCareers };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveCareerOpeningUp = (index: number) => {
    if (index <= 0) return;
    setContent((prev) => {
      const current = [...(prev.careers || INITIAL_CAREERS)];
      if (index <= 0 || index >= current.length) return prev;
      const temp = current[index - 1];
      current[index - 1] = current[index];
      current[index] = temp;
      const updated: SiteContent = { ...prev, careers: current };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveCareerOpeningDown = (index: number) => {
    setContent((prev) => {
      const current = [...(prev.careers || INITIAL_CAREERS)];
      if (index < 0 || index >= current.length - 1) return prev;
      const temp = current[index + 1];
      current[index + 1] = current[index];
      current[index] = temp;
      const updated: SiteContent = { ...prev, careers: current };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  // Career Applications Management
  const addCareerApplication = (appData: Omit<CareerApplication, 'id' | 'createdAt' | 'status'>) => {
    const newApp: CareerApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'new',
    };
    setContent((prev) => {
      const updatedApps = [newApp, ...(prev.careerApplications || [])];
      const updated: SiteContent = { ...prev, careerApplications: updatedApps };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const updateCareerApplicationStatus = (id: string, status: CareerApplication['status']) => {
    setContent((prev) => {
      const updatedApps = (prev.careerApplications || []).map((a) =>
        a.id === id ? { ...a, status } : a
      );
      const updated: SiteContent = { ...prev, careerApplications: updatedApps };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const deleteCareerApplication = (id: string) => {
    setContent((prev) => {
      const updatedApps = (prev.careerApplications || []).filter((a) => a.id !== id);
      const updated: SiteContent = { ...prev, careerApplications: updatedApps };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  // Owner Profile & Blog Management
  const updateOwnerProfile = (profileUpdates: Partial<OwnerProfile>) => {
    setContent((prev) => {
      const updatedProfile: OwnerProfile = {
        ...(prev.ownerProfile || INITIAL_OWNER_PROFILE),
        ...profileUpdates,
      };
      const updated: SiteContent = { ...prev, ownerProfile: updatedProfile };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const addOwnerBlog = (postData: Omit<OwnerBlogPost, 'id' | 'publishedAt'> & { publishedAt?: string }) => {
    const newPost: OwnerBlogPost = {
      ...postData,
      id: `blog-${Date.now()}`,
      publishedAt: postData.publishedAt || new Date().toISOString().split('T')[0],
    };
    setContent((prev) => {
      const updatedBlogs = [newPost, ...(prev.ownerBlogs || INITIAL_OWNER_BLOGS)];
      const updated: SiteContent = { ...prev, ownerBlogs: updatedBlogs };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const updateOwnerBlog = (id: string, updatedFields: Partial<OwnerBlogPost>) => {
    setContent((prev) => {
      const updatedBlogs = (prev.ownerBlogs || INITIAL_OWNER_BLOGS).map((b) =>
        b.id === id ? { ...b, ...updatedFields } : b
      );
      const updated: SiteContent = { ...prev, ownerBlogs: updatedBlogs };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const deleteOwnerBlog = (id: string) => {
    setContent((prev) => {
      const updatedBlogs = (prev.ownerBlogs || INITIAL_OWNER_BLOGS).filter((b) => b.id !== id);
      const updated: SiteContent = { ...prev, ownerBlogs: updatedBlogs };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveOwnerBlogUp = (index: number) => {
    if (index <= 0) return;
    setContent((prev) => {
      const current = [...(prev.ownerBlogs || INITIAL_OWNER_BLOGS)];
      if (index <= 0 || index >= current.length) return prev;
      const temp = current[index - 1];
      current[index - 1] = current[index];
      current[index] = temp;
      const updated: SiteContent = { ...prev, ownerBlogs: current };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  const moveOwnerBlogDown = (index: number) => {
    setContent((prev) => {
      const current = [...(prev.ownerBlogs || INITIAL_OWNER_BLOGS)];
      if (index < 0 || index >= current.length - 1) return prev;
      const temp = current[index + 1];
      current[index + 1] = current[index];
      current[index] = temp;
      const updated: SiteContent = { ...prev, ownerBlogs: current };
      persistAndSyncContent(updated);
      return updated;
    });
  };

  // Enquiry Management with Full Dual-Cloud Persistence & Real-Time Sync across all browsers
  const addEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'new',
    };

    setEnquiries((prev) => {
      const updated = [newEnq, ...prev.filter((e) => e.id !== newEnq.id)];
      try {
        localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(updated));
        if (typeof window !== 'undefined' && window.BroadcastChannel) {
          const ch = new BroadcastChannel('brand_origin_enquiries_sync');
          ch.postMessage(updated);
          ch.close();
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    try {
      await setDoc(doc(db, 'enquiries', newEnq.id), newEnq);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `enquiries/${newEnq.id}`);
    }

    // Persist to Cloud SQL relational database and broadcast to all connected browsers
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnq),
      });
      const data = await res.json();
      if (data?.enquiry) {
        setEnquiries((prev) => {
          const filtered = prev.filter((e) => e.id !== newEnq.id && e.id !== data.enquiry.id);
          const merged = [data.enquiry, ...filtered];
          try {
            localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch {
      // non-blocking fallback
    }
  };

  const updateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) => {
      const updated = prev.map((item) => (String(item.id) === String(id) ? { ...item, status } : item));
      try {
        localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(updated));
        if (typeof window !== 'undefined' && window.BroadcastChannel) {
          const ch = new BroadcastChannel('brand_origin_enquiries_sync');
          ch.postMessage(updated);
          ch.close();
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Update in Cloud SQL backend & broadcast to all browser tabs
    try {
      fetch(`/api/enquiries/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).catch(() => {});
    } catch {}

    if (currentUser) {
      try {
        await updateDoc(doc(db, 'enquiries', id), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `enquiries/${id}`);
      }
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries((prev) => {
      const updated = prev.filter((item) => String(item.id) !== String(id));
      try {
        localStorage.setItem('brand_origin_cms_enquiries_v2', JSON.stringify(updated));
        if (typeof window !== 'undefined' && window.BroadcastChannel) {
          const ch = new BroadcastChannel('brand_origin_enquiries_sync');
          ch.postMessage(updated);
          ch.close();
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Delete in Cloud SQL backend & broadcast to all browser tabs
    try {
      fetch(`/api/enquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch(() => {});
    } catch {}

    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'enquiries', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `enquiries/${id}`);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('brand_origin_cms_auth', 'true');
      } catch (e) {
        console.error(e);
      }
    } catch (err) {
      console.error('Google Sign-In failed', err);
      throw err;
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const normalized = email.trim().toLowerCase();
    if ((normalized === 'brandorigin@gmail.com' || normalized === 'aibrandorigin@gmail.com') && pass === '111111') {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('brand_origin_cms_auth', 'true');
      } catch (e) {
        console.error(e);
      }
      // Exchange credentials with backend to acquire Firebase custom token for real-time Firestore sync
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalized, password: pass }),
        });
        const data = await res.json();
        if (data.customToken) {
          await signInWithCustomToken(auth, data.customToken);
        }
      } catch (authErr) {
        console.warn('Firebase custom token sign-in notice:', authErr);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    signOut(auth).catch(() => {});
    try {
      sessionStorage.removeItem('brand_origin_cms_auth');
    } catch (e) {
      console.error(e);
    }
  };

  const openCms = () => setIsCmsOpen(true);
  const closeCms = () => setIsCmsOpen(false);

  return (
    <CmsContext.Provider
      value={{
        content,
        updateContent,
        resetContent,
        addProject,
        updateProject,
        deleteProject,
        moveProjectUp,
        moveProjectDown,
        addService,
        updateService,
        deleteService,
        moveServiceUp,
        moveServiceDown,
        addCareerOpening,
        updateCareerOpening,
        deleteCareerOpening,
        moveCareerOpeningUp,
        moveCareerOpeningDown,
        addCareerApplication,
        updateCareerApplicationStatus,
        deleteCareerApplication,
        updateOwnerProfile,
        addOwnerBlog,
        updateOwnerBlog,
        deleteOwnerBlog,
        moveOwnerBlogUp,
        moveOwnerBlogDown,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        isAuthenticated,
        currentUser,
        isAuthReady,
        signInWithGoogle,
        login,
        logout,
        isCmsOpen,
        openCms,
        closeCms,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
