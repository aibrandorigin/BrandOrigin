import React, { useState, useRef, useEffect } from 'react';
import { useCms } from '../context/CmsContext';
import { Enquiry, CaseStudyItem, ServiceItem, CareerOpening, OwnerBlogPost } from '../types';
import {
  X,
  Lock,
  LogOut,
  Inbox,
  FileText,
  Sliders,
  CheckCircle2,
  Trash2,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Mail,
  Building,
  Calendar,
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Globe,
  Link,
  Check,
  Image as ImageIcon,
  Upload,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { BrandOriginLogo } from './BrandOriginLogo';

export const CmsDashboardModal: React.FC = () => {
  const {
    isCmsOpen,
    closeCms,
    isAuthenticated,
    login,
    logout,
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
    updateCareerApplicationStatus,
    deleteCareerApplication,
    updateOwnerProfile,
    addOwnerBlog,
    updateOwnerBlog,
    deleteOwnerBlog,
    moveOwnerBlogUp,
    moveOwnerBlogDown,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    currentUser,
    signInWithGoogle,
  } = useCms();

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    'enquiries' | 'careers' | 'blog' | 'projects' | 'header' | 'hero' | 'stages' | 'about' | 'services' | 'performance'
  >('enquiries');

  // Form draft state for content editing
  const [draftContent, setDraftContent] = useState(content);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formNotice, setFormNotice] = useState('');

  // Project editing & file upload state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const addProjectFileInputRef = useRef<HTMLInputElement | null>(null);
  const editProjectFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingProjectPhoto, setIsUploadingProjectPhoto] = useState(false);
  const [uploadedProjectFileName, setUploadedProjectFileName] = useState('');
  const [projectPhotoError, setProjectPhotoError] = useState('');

  const [newProjectForm, setNewProjectForm] = useState<Omit<CaseStudyItem, 'id'>>({
    client: '',
    industry: '',
    year: '2026',
    image: '',
    headline: '',
    selectedSteps: ['idea', 'identity', 'digital', 'growth'],
    stages: {
      idea: '',
      identity: '',
      digital: '',
      marketing: '',
      growth: '',
    },
    metrics: [
      { metric: '₹100 Cr', label: 'Commercial Pipeline' },
      { metric: '10x', label: 'Growth Acceleration' },
      { metric: '95%', label: 'Category Traction' },
    ],
  });

  // Services management state
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceForm, setNewServiceForm] = useState({
    title: '',
    category: 'Genesis Stage',
    description: '',
    deliverablesText: '',
    impactMetric: '',
  });

  // Careers / Openings management state
  const [careersSubTab, setCareersSubTab] = useState<'openings' | 'applications'>('openings');
  const [isAddingCareer, setIsAddingCareer] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [newCareerForm, setNewCareerForm] = useState({
    title: '',
    department: 'Identity & Design',
    location: 'Bengaluru · Hybrid',
    type: 'Full-Time',
    experience: '3–6 Years',
    compensation: '₹18L – ₹28L / yr',
    summary: '',
    responsibilitiesText: '',
    requirementsText: '',
    status: 'active' as CareerOpening['status'],
  });

  // Owner's Blog & Owner Profile management state
  const [blogSubTab, setBlogSubTab] = useState<'owner' | 'posts'>('owner');
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const ownerPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const newBlogOwnerPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const newBlogCoverPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [newBlogForm, setNewBlogForm] = useState({
    title: '',
    category: 'Founder Story',
    readTime: 'Origin Story',
    excerpt: '',
    content: '',
    ownerName: '',
    ownerRole: '',
    ownerImage: '',
    coverImage: '',
    status: 'published' as OwnerBlogPost['status'],
  });

  useEffect(() => {
    if (!isCmsOpen || typeof window === 'undefined') return;
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/blog')) {
      setActiveTab('blog');
      setBlogSubTab('owner');
    } else if (path.startsWith('/careers')) {
      setActiveTab('careers');
    }
  }, [isCmsOpen]);

  // Helper to read and optimize photo uploaded from system
  const readAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        setProjectPhotoError('Please select an image file (JPG, PNG, WEBP, SVG).');
        return reject(new Error('Invalid image file type'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) return resolve('');
        if (file.type.includes('svg')) {
          return resolve(result);
        }
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(result);
          }
        };
        img.onerror = () => resolve(result);
        img.src = result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadProjectPhoto = async (file: File) => {
    try {
      setIsUploadingProjectPhoto(true);
      setProjectPhotoError('');
      const dataUrl = await readAndCompressImage(file);
      setNewProjectForm((prev) => ({ ...prev, image: dataUrl }));
      setUploadedProjectFileName(file.name);
    } catch {
      setProjectPhotoError('Could not process uploaded image from system.');
    } finally {
      setIsUploadingProjectPhoto(false);
    }
  };

  const handleEditProjectPhoto = async (projectId: string, file: File) => {
    try {
      const dataUrl = await readAndCompressImage(file);
      updateProject(projectId, { image: dataUrl });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setProjectPhotoError('Could not process uploaded image from system.');
    }
  };

  // Sync draft when content changes
  React.useEffect(() => {
    setDraftContent(content);
  }, [content]);

  if (!isCmsOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(emailInput, passwordInput);
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    } else {
      setLoginError('');
      setEmailInput('');
      setPasswordInput('');
    }
  };

  const handleSaveContent = () => {
    updateContent(draftContent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.client.trim() || !newProjectForm.headline.trim()) {
      setFormNotice('Please fill out client name and headline.');
      return;
    }
    if (!newProjectForm.image) {
      setFormNotice('Please upload a project photo from your system.');
      return;
    }
    setFormNotice('');
    addProject(newProjectForm);
    setIsAddingProject(false);
    setUploadedProjectFileName('');
    setNewProjectForm({
      client: '',
      industry: '',
      year: '2026',
      image: '',
      headline: '',
      selectedSteps: ['idea', 'identity', 'digital', 'growth'],
      stages: {
        idea: '',
        identity: '',
        digital: '',
        marketing: '',
        growth: '',
      },
      metrics: [
        { metric: '₹50 Cr', label: 'Pipeline Impact' },
        { metric: '8.4x', label: 'Scale Factor' },
        { metric: '92%', label: 'Market Recall' },
      ],
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceForm.title.trim() || !newServiceForm.description.trim()) {
      setFormNotice('Please fill out service title and description.');
      return;
    }
    setFormNotice('');
    const deliverables = newServiceForm.deliverablesText
      ? newServiceForm.deliverablesText
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    addService({
      title: newServiceForm.title.trim(),
      category: newServiceForm.category.trim() || 'Genesis Stage',
      description: newServiceForm.description.trim(),
      deliverables: deliverables.length > 0 ? deliverables : ['Strategy & Architecture', 'Full-Scale Execution'],
      impactMetric: newServiceForm.impactMetric.trim() || '3.0x Velocity',
    });

    setIsAddingService(false);
    setNewServiceForm({
      title: '',
      category: 'Genesis Stage',
      description: '',
      deliverablesText: '',
      impactMetric: '',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateCareerOpening = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareerForm.title.trim() || !newCareerForm.summary.trim()) {
      setFormNotice('Please provide the opening title and role summary.');
      return;
    }
    setFormNotice('');
    const responsibilities = newCareerForm.responsibilitiesText
      ? newCareerForm.responsibilitiesText
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const requirements = newCareerForm.requirementsText
      ? newCareerForm.requirementsText
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    addCareerOpening({
      title: newCareerForm.title.trim(),
      department: newCareerForm.department.trim() || 'Multidisciplinary',
      location: newCareerForm.location.trim() || 'Bengaluru · Hybrid',
      type: newCareerForm.type.trim() || 'Full-Time',
      experience: newCareerForm.experience.trim() || '3+ Years',
      compensation: newCareerForm.compensation.trim() || 'Competitive (₹ INR)',
      summary: newCareerForm.summary.trim(),
      responsibilities:
        responsibilities.length > 0
          ? responsibilities
          : ['Partner with founders and multidisciplinary leads to ship category-defining work.'],
      requirements:
        requirements.length > 0
          ? requirements
          : ['Proven portfolio of high-craft shipped work and strong collaborative execution.'],
      status: newCareerForm.status,
    });

    setIsAddingCareer(false);
    setNewCareerForm({
      title: '',
      department: 'Identity & Design',
      location: 'Bengaluru · Hybrid',
      type: 'Full-Time',
      experience: '3–6 Years',
      compensation: '₹18L – ₹28L / yr',
      summary: '',
      responsibilitiesText: '',
      requirementsText: '',
      status: 'active',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleUploadOwnerProfilePhoto = async (file: File) => {
    try {
      setFormNotice('');
      const dataUrl = await readAndCompressImage(file);
      updateOwnerProfile({ image: dataUrl });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setFormNotice('Could not process uploaded owner image.');
    }
  };

  const handleCreateOwnerBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogForm.title.trim() || !newBlogForm.content.trim()) {
      setFormNotice('Please provide the blog title and essay content.');
      return;
    }
    setFormNotice('');
    const currentOwner = content.ownerProfile || {
      name: 'Founder & Principal Architect',
      role: 'Founder & Executive Director · Brand Origin',
      image: '/src/assets/images/brand_origin_logo_1790935169338.jpg',
      bio: '',
      quote: '',
    };

    // If admin uploaded an owner image in the new blog form, also sync it to ownerProfile so it reflects everywhere
    const chosenOwnerImg = newBlogForm.ownerImage.trim() || currentOwner.image;
    const chosenOwnerName = newBlogForm.ownerName.trim() || currentOwner.name;
    const chosenOwnerRole = newBlogForm.ownerRole.trim() || currentOwner.role;

    if (newBlogForm.ownerImage.trim()) {
      updateOwnerProfile({
        image: chosenOwnerImg,
        name: chosenOwnerName,
        role: chosenOwnerRole,
      });
    }

    addOwnerBlog({
      title: newBlogForm.title.trim(),
      category: newBlogForm.category.trim() || 'Founder Essays',
      readTime: newBlogForm.readTime.trim() || '5 min read',
      excerpt:
        newBlogForm.excerpt.trim() ||
        newBlogForm.content.trim().substring(0, 180) + '...',
      content: newBlogForm.content.trim(),
      ownerName: chosenOwnerName,
      ownerRole: chosenOwnerRole,
      ownerImage: chosenOwnerImg,
      coverImage: newBlogForm.coverImage.trim() || undefined,
      status: newBlogForm.status,
    });

    setIsAddingBlog(false);
    setNewBlogForm({
      title: '',
      category: 'Founder Essays',
      readTime: '5 min read',
      excerpt: '',
      content: '',
      ownerName: '',
      ownerRole: '',
      ownerImage: '',
      coverImage: '',
      status: 'published',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const projectsList = content.projects || [];
  const careersList = content.careers || [];
  const careerApplicationsList = content.careerApplications || [];
  const ownerBlogsList = content.ownerBlogs || [];
  const ownerProfileData = {
    name: content.ownerProfile?.name ?? 'Founder & Managing Director',
    role: content.ownerProfile?.role ?? 'Founder & Principal Architect · Brand Origin',
    headline: content.ownerProfile?.headline ?? 'THE VISION & LEADERSHIP BEHIND BRAND ORIGIN.',
    image: content.ownerProfile?.image ?? '',
    bio:
      content.ownerProfile?.bio ??
      `As the Founder and Principal Architect of Brand Origin, he established the agency with a singular conviction: ambitious ideas deserve more than fragmented agencies and surface-level aesthetics—they deserve a unified origin where strategy, identity, technology, and commercial growth compound together.\n\nWith deep multidisciplinary expertise spanning category positioning, mathematical brand identity systems, high-frequency digital engineering, and quantitative growth architecture, he works directly with founders and executive teams to transform raw concepts into category-leading ventures.\n\nUnder his leadership, Brand Origin has partnered with high-growth companies across clean mobility, quantitative fintech, luxury acoustics, and enterprise technology—architecting brand ecosystems that command lasting market authority and measurable revenue velocity.`,
    quote:
      content.ownerProfile?.quote ??
      'We do not just design how a brand looks—we architect the foundation from which its entire market identity, digital experience, and commercial growth originate.',
  };
  const hasUploadedOwnerPhoto =
    Boolean(ownerProfileData.image) &&
    !ownerProfileData.image.includes('brand_origin_logo');
  const newApplicationsCount = careerApplicationsList.filter((a) => a.status === 'new').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div
        className={`relative w-full my-auto bg-[#090909] border border-white/[0.12] rounded-xs sm:rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-1.25rem)] sm:max-h-[calc(100dvh-2rem)] ${
          isAuthenticated ? 'max-w-6xl h-[min(88dvh,840px)]' : 'max-w-md'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-[#0d0d0d] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandOriginLogo variant="mark" size={24} glow={false} />
            <div className="min-w-0">
              <div className="font-['Syne'] text-xs sm:text-sm font-bold text-white tracking-wide flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span>BRAND ORIGIN · CMS EXECUTIVE</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#E31B23]/20 text-[#E31B23] border border-[#E31B23]/40">
                  {isAuthenticated ? 'AUTHENTICATED' : 'ACCESS LOCKED'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {currentUser?.email && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-[#AAA] bg-white/[0.05] border border-white/[0.1] px-2 py-1 rounded-xs">
                    {currentUser.email}
                  </span>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-[#888] hover:text-white bg-[#141414] hover:bg-[#1f1f1f] rounded-xs transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
            <button
              onClick={closeCms}
              className="text-[#777] hover:text-white p-1.5 rounded-xs transition-colors cursor-pointer"
              aria-label="Close CMS"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="p-4 sm:p-6 w-full overflow-y-auto flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-full bg-[#181011] border border-[#E31B23]/50 flex items-center justify-center text-[#E31B23] mb-3 shadow-[0_0_20px_rgba(227,27,35,0.35)] shrink-0">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="font-['Syne'] text-lg sm:text-xl font-bold text-white uppercase">
              EXECUTIVE CMS ACCESS
            </h3>
            <p className="text-xs text-[#888] mt-1 mb-4 font-light leading-relaxed">
              Enter administrator credentials to manage inquiries, project case studies, and live website content.
            </p>

            {loginError && (
              <div className="w-full p-2.5 mb-3 text-xs font-mono bg-red-950/60 border border-red-500/50 text-red-300 rounded-xs text-left">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="w-full space-y-3 text-left">
              <div>
                <label className="text-[10px] sm:text-[11px] font-mono text-[#888] block mb-1">
                  ADMIN EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="brandorigin@gmail.com"
                  className="w-full bg-[#141414] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs sm:text-sm text-white placeholder-[#555] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-mono text-[#888] block mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-[#141414] border border-white/[0.1] focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs sm:text-sm text-white placeholder-[#555] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_20px_rgba(227,27,35,0.4)] font-['Syne'] cursor-pointer"
              >
                Authenticate &amp; Enter CMS
              </button>

              <div className="relative my-2.5 flex items-center justify-center">
                <div className="border-t border-white/[0.08] w-full absolute" />
                <span className="bg-[#090909] px-2 text-[10px] font-mono text-[#666] relative">
                  OR SIGN IN WITH FIREBASE
                </span>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                  } catch (e: any) {
                    setLoginError(e?.message || 'Firebase Google Sign-In failed');
                  }
                }}
                className="w-full py-2 text-xs font-mono text-white bg-[#141414] hover:bg-[#1e1e1e] border border-white/[0.12] hover:border-white/[0.25] rounded-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google (Firebase)</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Multi-Tab Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/[0.08] p-3 sm:p-4 bg-[#0a0a0a] flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`flex items-center justify-between p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'enquiries'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#E31B23]" />
                  <span>Enquiries (₹)</span>
                </div>
                {newEnquiriesCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#E31B23] text-white text-[10px] flex items-center justify-center font-bold">
                    {newEnquiriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('careers')}
                className={`flex items-center justify-between p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'careers'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#E31B23]" />
                  <span>Careers &amp; Openings</span>
                </div>
                <div className="flex items-center gap-1">
                  {newApplicationsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#E31B23] text-white text-[10px] flex items-center justify-center font-bold">
                      {newApplicationsCount}
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-white/10 text-white">
                    {careersList.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center justify-between p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'blog'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#E31B23]" />
                  <span>Owner&apos;s Blog</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-white/10 text-white">
                  {ownerBlogsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center justify-between p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'projects'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#E31B23]" />
                  <span>Projects / Work</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-white/10 text-white">
                  {projectsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('header')}
                className={`flex items-center gap-2 p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'header'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <Link className="w-4 h-4 text-[#E31B23]" />
                <span>Origin Labs Link</span>
              </button>

              <div className="hidden md:block text-[9px] font-mono uppercase tracking-widest text-[#555] px-3 pt-3 pb-1">
                WEBSITE CONTENT EDITORS
              </div>

              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-2 p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'hero'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <FileText className="w-4 h-4 text-[#E31B23]" />
                <span>Hero &amp; Slogan</span>
              </button>

              <button
                onClick={() => setActiveTab('stages')}
                className={`flex items-center gap-2 p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'stages'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <Sliders className="w-4 h-4 text-[#E31B23]" />
                <span>Stages Headlines</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2 p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'services'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#E31B23]" />
                <span>Services (9)</span>
              </button>

              <button
                onClick={() => setActiveTab('performance')}
                className={`flex items-center gap-2 p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'performance'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-[#E31B23]" />
                <span>Performance &amp; Scale</span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2 p-2.5 rounded-xs text-xs font-mono uppercase tracking-wider text-left transition-all whitespace-nowrap md:whitespace-normal ${
                  activeTab === 'about'
                    ? 'bg-[#181011] text-white border border-[#E31B23]/60'
                    : 'text-[#888] hover:text-white hover:bg-[#121212]'
                }`}
              >
                <Building className="w-4 h-4 text-[#E31B23]" />
                <span>About &amp; Tenets</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-white/[0.08]">
                <button
                  onClick={resetContent}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-mono text-[#777] hover:text-white hover:bg-[#141414] rounded-xs transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset All to Defaults</span>
                </button>
              </div>
            </div>

            {/* Main Editor Pane */}
            <div className="flex-1 p-4 sm:p-7 overflow-y-auto">
              {/* TAB 1: Enquiries & Lead Pipeline (in Indian Rupees) */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                    <div>
                      <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                        FOUNDER ENQUIRIES PIPELINE
                      </h4>
                      <div className="text-xs text-[#888] font-mono mt-0.5">
                        Client briefs submitted through the website (Values denominated in ₹ INR)
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[#888]">
                      TOTAL LEADS: <strong className="text-white">{enquiries.length}</strong>
                    </div>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-sm">
                      <Inbox className="w-10 h-10 text-[#666] mx-auto mb-2" />
                      <div className="text-sm text-[#888] font-mono">No customer enquiries received yet.</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="p-5 bg-[#101010] border border-white/[0.07] rounded-sm space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  enq.status === 'new'
                                    ? 'bg-[#E31B23] animate-pulse'
                                    : enq.status === 'reviewing'
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400'
                                }`}
                              />
                              <div>
                                <span className="font-['Syne'] text-base font-bold text-white">
                                  {enq.name}
                                </span>
                                <span className="text-xs text-[#888] font-mono ml-2">
                                  ({enq.company || 'Private Venture'})
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                              <select
                                value={enq.status}
                                onChange={(e) =>
                                  updateEnquiryStatus(enq.id, e.target.value as Enquiry['status'])
                                }
                                className="bg-[#181818] border border-white/10 text-xs text-white rounded-xs px-2.5 py-1.5 font-mono outline-none focus:border-[#E31B23]"
                              >
                                <option value="new">Status: New</option>
                                <option value="reviewing">Status: In Review</option>
                                <option value="contacted">Status: Contacted</option>
                                <option value="closed">Status: Archived</option>
                              </select>

                              <button
                                onClick={() => deleteEnquiry(enq.id)}
                                className="text-[#666] hover:text-red-400 p-1.5 transition-colors rounded-xs hover:bg-white/[0.05]"
                                title="Delete enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-[#AAA]">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#E31B23]" />
                              <a href={`mailto:${enq.email}`} className="text-white hover:underline truncate">
                                {enq.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#888]" />
                              <span>{enq.timeline}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-400 font-bold font-mono">₹</span>
                              <span className="text-white font-semibold">{enq.budget}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-[#0a0a0a] rounded-xs border border-white/[0.04] text-xs text-[#DDD] font-light leading-relaxed">
                            <span className="font-mono text-[#777] uppercase text-[10px] block mb-1">
                              STAGE REQUESTED: {enq.stage}
                            </span>
                            {enq.concept || 'No concept summary provided.'}
                          </div>

                          <div className="text-[10px] font-mono text-[#666] text-right">
                            SUBMITTED AT: {enq.createdAt}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Projects / Work Case Studies Management (Add / Delete / Change Order / Edit) */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div>
                      <h4 className="font-['Syne'] text-xl font-bold text-white uppercase flex items-center gap-2">
                        <span>CASE STUDIES &amp; PROJECTS MANAGEMENT</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#E31B23]/20 text-[#E31B23] border border-[#E31B23]/40">
                          {projectsList.length} LIVE
                        </span>
                      </h4>
                      <div className="text-xs text-[#888] font-mono mt-0.5">
                        Add new projects, modify existing case studies, delete with confirmation, and re-sequence display order
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddingProject(!isAddingProject)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingProject ? 'Cancel Form' : '+ Add New Project'}</span>
                    </button>
                  </div>

                  {/* Add New Project Form with All Custom Stages & Metrics in ₹ */}
                  {isAddingProject && (
                    <form onSubmit={handleCreateProject} className="p-5 sm:p-6 bg-[#121212] border border-[#E31B23]/60 rounded-xs space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono text-[#E31B23] font-bold uppercase">
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>PUBLISH NEW CASE STUDY TO LIVE WEBSITE</span>
                        </span>
                        <button type="button" onClick={() => setIsAddingProject(false)} className="text-[#888] hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-[#AAA] block mb-1">CLIENT NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AETHER AUTOMATION"
                            value={newProjectForm.client}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, client: e.target.value })}
                            className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[#AAA] block mb-1">INDUSTRY *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Autonomous Robotics & AI"
                            value={newProjectForm.industry}
                            onChange={(e) => setNewProjectForm({ ...newProjectForm, industry: e.target.value })}
                            className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#AAA] block mb-1">HEADLINE SUMMARY (DENOMINATED IN ₹ INR) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robotics Platform: From Founder Thesis to ₹250 Cr Valuation"
                          value={newProjectForm.headline}
                          onChange={(e) => setNewProjectForm({ ...newProjectForm, headline: e.target.value })}
                          className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#AAA] block mb-1">
                          UPLOAD PROJECT PHOTO FROM SYSTEM *
                        </label>

                        {/* Hidden native file input */}
                        <input
                          type="file"
                          ref={addProjectFileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleUploadProjectPhoto(e.target.files[0]);
                            }
                          }}
                        />

                        {!newProjectForm.image ? (
                          /* Drag-and-drop & click upload zone */
                          <div
                            onClick={() => addProjectFileInputRef.current?.click()}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                handleUploadProjectPhoto(e.dataTransfer.files[0]);
                              }
                            }}
                            className="border-2 border-dashed border-white/20 hover:border-[#E31B23] bg-[#161616] hover:bg-[#1a1314] rounded-xs p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#222] group-hover:bg-[#E31B23]/20 border border-white/10 group-hover:border-[#E31B23]/40 flex items-center justify-center transition-colors">
                              <Upload className="w-5 h-5 text-[#AAA] group-hover:text-[#E31B23] transition-colors" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-[#E31B23] transition-colors">
                                {isUploadingProjectPhoto ? 'Processing system photo...' : 'Click to choose photo from your system'}
                              </div>
                              <div className="text-[10px] font-mono text-[#777] mt-0.5">
                                Drag and drop or browse files · Supports JPG, PNG, WEBP, SVG
                              </div>
                            </div>
                            <button
                              type="button"
                              className="mt-1 px-3 py-1.5 bg-[#252525] hover:bg-[#E31B23] text-white text-[10px] font-mono rounded-xs transition-colors border border-white/10 flex items-center gap-1.5"
                            >
                              <Upload className="w-3 h-3" />
                              Browse System Files
                            </button>
                          </div>
                        ) : (
                          /* Uploaded system photo preview card */
                          <div className="p-3 bg-[#161616] border border-[#E31B23]/50 rounded-xs flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-16 h-12 rounded-xs overflow-hidden bg-black shrink-0 border border-white/15">
                                <img
                                  src={newProjectForm.image}
                                  alt="Project Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white flex items-center gap-2 truncate">
                                  <span className="truncate">{uploadedProjectFileName || 'System Photo Uploaded'}</span>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xs shrink-0">
                                    ✓ Uploaded
                                  </span>
                                </div>
                                <div className="text-[10px] font-mono text-[#888]">
                                  Ready to publish with case study
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => addProjectFileInputRef.current?.click()}
                                className="px-2.5 py-1.5 text-[10px] font-mono text-white bg-[#222] hover:bg-[#2a2a2a] border border-white/15 rounded-xs transition-colors flex items-center gap-1"
                              >
                                <Upload className="w-3 h-3 text-[#E31B23]" />
                                Change Photo
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewProjectForm({ ...newProjectForm, image: '' });
                                  setUploadedProjectFileName('');
                                }}
                                className="px-2 py-1.5 text-[10px] font-mono text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-500/20 rounded-xs transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                        {projectPhotoError && (
                          <div className="text-[10px] font-mono text-red-400 mt-1">
                            {projectPhotoError}
                          </div>
                        )}
                      </div>

                      {/* Origin Execution Steps (Select Certain Steps, No Descriptions) */}
                      <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-mono text-[#E31B23] uppercase font-bold">
                            ORIGIN EXECUTION STEPS (SELECT CERTAIN STEPS):
                          </div>
                          <span className="text-[9px] font-mono text-[#888]">
                            {(newProjectForm.selectedSteps || []).length} OF 5 SELECTED
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { key: 'idea', num: '01', title: 'IDEA' },
                            { key: 'identity', num: '02', title: 'IDENTITY' },
                            { key: 'digital', num: '03', title: 'DIGITAL' },
                            { key: 'marketing', num: '04', title: 'MARKETING' },
                            { key: 'growth', num: '05', title: 'SCALE' },
                          ].map((step) => {
                            const isSel = (newProjectForm.selectedSteps || []).includes(step.key as any);
                            return (
                              <button
                                key={step.key}
                                type="button"
                                onClick={() => {
                                  const cur = newProjectForm.selectedSteps || [];
                                  const next = isSel
                                    ? cur.filter((k) => k !== step.key)
                                    : [...cur, step.key as any];
                                  setNewProjectForm({ ...newProjectForm, selectedSteps: next });
                                }}
                                className={`p-2.5 rounded-xs border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                  isSel
                                    ? 'bg-[#180e0f] border-[#E31B23] text-white shadow-[0_0_10px_rgba(227,27,35,0.2)]'
                                    : 'bg-[#141414] border-white/10 text-[#666] hover:text-[#999]'
                                }`}
                              >
                                <span className={`text-[9px] font-mono font-bold ${isSel ? 'text-[#E31B23]' : 'text-[#555]'}`}>
                                  {step.num} · {isSel ? 'ACTIVE' : 'OFF'}
                                </span>
                                <span className="text-[11px] font-['Syne'] font-bold uppercase mt-1">
                                  {step.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3 Quantified Metrics in ₹ */}
                      <div className="pt-2 border-t border-white/[0.06]">
                        <div className="text-[10px] font-mono text-[#E31B23] uppercase font-bold mb-2">
                          3 QUANTIFIED COMMERCIAL METRICS (IN ₹ RUPEES):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {newProjectForm.metrics.map((metricItem, mIdx) => (
                            <div key={mIdx} className="p-2.5 bg-[#181818] rounded-xs border border-white/[0.05]">
                              <label className="text-[9px] font-mono text-[#888] block mb-1">METRIC {mIdx + 1} (₹)</label>
                              <input
                                type="text"
                                placeholder="e.g. ₹250 Cr"
                                value={metricItem.metric}
                                onChange={(e) => {
                                  const updated = [...newProjectForm.metrics];
                                  updated[mIdx] = { ...updated[mIdx], metric: e.target.value };
                                  setNewProjectForm({ ...newProjectForm, metrics: updated });
                                }}
                                className="w-full bg-[#222] border border-white/10 rounded-xs p-1.5 text-xs text-[#E31B23] font-bold outline-none mb-1 font-mono"
                              />
                              <input
                                type="text"
                                placeholder="e.g. Pre-Order Book"
                                value={metricItem.label}
                                onChange={(e) => {
                                  const updated = [...newProjectForm.metrics];
                                  updated[mIdx] = { ...updated[mIdx], label: e.target.value };
                                  setNewProjectForm({ ...newProjectForm, metrics: updated });
                                }}
                                className="w-full bg-[#222] border border-white/10 rounded-xs p-1.5 text-[10px] text-[#BBB] outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_18px_rgba(227,27,35,0.4)] flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publish New Case Study to Live Showcase</span>
                      </button>
                    </form>
                  )}

                  {/* List of Existing Projects with Reorder & Edit / Delete */}
                  <div className="space-y-4">
                    {projectsList.map((project, index) => {
                      const isEditing = editingProjectId === project.id;
                      return (
                        <div
                          key={project.id || index}
                          className="p-4 sm:p-5 bg-[#111111] border border-white/[0.08] hover:border-white/[0.16] rounded-sm space-y-3 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.05] pb-3">
                            <div className="flex items-center gap-3">
                              {/* Position Badge */}
                              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xs bg-[#1a1112] border border-[#E31B23]/40 text-[#E31B23] shrink-0 font-mono">
                                <span className="text-[9px] uppercase font-light">POS</span>
                                <span className="text-sm font-bold leading-none">#{index + 1}</span>
                              </div>

                              <div className="w-14 h-11 rounded-xs overflow-hidden bg-black shrink-0 border border-white/10">
                                <img
                                  src={project.image}
                                  alt={project.client}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div>
                                <div className="font-['Syne'] text-base font-bold text-white uppercase flex items-center gap-2">
                                  <span>{project.client}</span>
                                </div>
                                <div className="text-[11px] text-[#888] font-mono">
                                  {project.industry}
                                </div>
                              </div>
                            </div>

                            {/* Reorder and Edit / Delete Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Move Up Button */}
                              <button
                                onClick={() => moveProjectUp(index)}
                                disabled={index === 0}
                                className={`px-2.5 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
                                  index === 0
                                    ? 'opacity-25 border-white/5 text-[#555] cursor-not-allowed'
                                    : 'border-white/15 text-white hover:bg-[#1a1112] hover:border-[#E31B23] text-[#E31B23]'
                                }`}
                                title="Move project up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                                <span>Move Up</span>
                              </button>

                              {/* Move Down Button */}
                              <button
                                onClick={() => moveProjectDown(index)}
                                disabled={index === projectsList.length - 1}
                                className={`px-2.5 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
                                  index === projectsList.length - 1
                                    ? 'opacity-25 border-white/5 text-[#555] cursor-not-allowed'
                                    : 'border-white/15 text-white hover:bg-[#1a1112] hover:border-[#E31B23] text-[#E31B23]'
                                }`}
                                title="Move project down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                                <span>Move Down</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => setEditingProjectId(isEditing ? null : project.id)}
                                className={`px-3 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
                                  isEditing
                                    ? 'bg-[#E31B23] text-white border-[#E31B23]'
                                    : 'bg-[#181818] hover:bg-[#202020] border-white/15 text-white'
                                }`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>{isEditing ? 'Close Edit' : 'Edit Project'}</span>
                              </button>

                              {/* Delete Button with Confirmation Prompt */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to permanently delete project "${project.client}" from the website showcase?`)) {
                                    deleteProject(project.id);
                                    if (editingProjectId === project.id) {
                                      setEditingProjectId(null);
                                    }
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950 border border-red-500/40 hover:border-red-500 text-red-200 rounded-xs text-xs font-mono flex items-center gap-1 transition-all"
                                title="Delete project with confirmation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-[#CCC] font-light leading-relaxed">
                            <strong className="text-white font-mono text-[10px] uppercase block mb-0.5">HEADLINE:</strong>
                            {project.headline}
                          </div>

                          {/* Quantified Metrics in INR */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1 text-left">
                            {project.metrics.map((m, mIdx) => (
                              <div key={mIdx} className="bg-[#0c0c0c] p-2 rounded-xs border border-white/[0.04]">
                                <div className="text-[#E31B23] font-['Syne'] font-bold text-xs">{m.metric}</div>
                                <div className="text-[10px] font-mono text-[#777]">{m.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Full Inline Edit Form with All 5 Custom Stages */}
                          {isEditing && (
                            <div className="p-4 sm:p-5 bg-[#0a0a0a] border border-[#E31B23]/50 rounded-xs space-y-4 mt-3 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                                <div className="text-xs font-mono text-[#E31B23] font-bold uppercase flex items-center gap-2">
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>EDITING PROJECT: {project.client}</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#777]">CHANGES AUTO-SAVE TO LIVE SITE</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <div>
                                  <label className="text-[9px] font-mono text-[#888] block mb-1">CLIENT NAME</label>
                                  <input
                                    type="text"
                                    value={project.client}
                                    onChange={(e) => updateProject(project.id, { client: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-mono text-[#888] block mb-1">INDUSTRY</label>
                                  <input
                                    type="text"
                                    value={project.industry}
                                    onChange={(e) => updateProject(project.id, { industry: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-mono text-[#888] block mb-1">HEADLINE SUMMARY (₹ INR)</label>
                                <input
                                  type="text"
                                  value={project.headline}
                                  onChange={(e) => updateProject(project.id, { headline: e.target.value })}
                                  className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] font-mono text-[#888] block mb-1">
                                  PROJECT PHOTO (UPLOAD FROM SYSTEM)
                                </label>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#141414] border border-white/10 rounded-xs">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-16 h-12 rounded-xs overflow-hidden bg-black shrink-0 border border-white/15">
                                      <img
                                        src={project.image}
                                        alt={project.client}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs text-white font-medium truncate">
                                        {project.image.startsWith('data:') ? 'Custom Photo from System' : 'Current Project Photo'}
                                      </div>
                                      <div className="text-[9px] text-[#777] font-mono">
                                        Select a replacement photo from your computer
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <input
                                      type="file"
                                      id={`edit-photo-${project.id}`}
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleEditProjectPhoto(project.id, e.target.files[0]);
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`edit-photo-${project.id}`}
                                      className="px-3 py-1.5 bg-[#222] hover:bg-[#E31B23] text-white text-[10px] font-mono rounded-xs cursor-pointer transition-colors flex items-center gap-1.5 border border-white/10"
                                    >
                                      <Upload className="w-3 h-3" />
                                      Upload New Photo
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Origin Execution Steps (Select Certain Steps, No Descriptions) */}
                              <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                                <div className="flex items-center justify-between">
                                  <div className="text-[10px] font-mono text-[#E31B23] uppercase font-bold">
                                    ORIGIN EXECUTION STEPS (SELECT CERTAIN STEPS):
                                  </div>
                                  <span className="text-[9px] font-mono text-[#888]">
                                    {((project.selectedSteps || ['idea', 'identity', 'digital', 'growth']) as any[]).length} OF 5 SELECTED
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                  {[
                                    { key: 'idea', num: '01', title: 'IDEA' },
                                    { key: 'identity', num: '02', title: 'IDENTITY' },
                                    { key: 'digital', num: '03', title: 'DIGITAL' },
                                    { key: 'marketing', num: '04', title: 'MARKETING' },
                                    { key: 'growth', num: '05', title: 'SCALE' },
                                  ].map((step) => {
                                    const currentSteps: any[] = project.selectedSteps && project.selectedSteps.length > 0
                                      ? project.selectedSteps
                                      : project.stages
                                      ? Object.keys(project.stages).filter((k) => Boolean((project.stages as any)[k]))
                                      : ['idea', 'identity', 'digital', 'growth'];
                                    const isSel = currentSteps.includes(step.key);
                                    return (
                                      <button
                                        key={step.key}
                                        type="button"
                                        onClick={() => {
                                          const next = isSel
                                            ? currentSteps.filter((k) => k !== step.key)
                                            : [...currentSteps, step.key];
                                          updateProject(project.id, { selectedSteps: next });
                                        }}
                                        className={`p-2.5 rounded-xs border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                          isSel
                                            ? 'bg-[#180e0f] border-[#E31B23] text-white shadow-[0_0_10px_rgba(227,27,35,0.2)]'
                                            : 'bg-[#141414] border-white/10 text-[#666] hover:text-[#999]'
                                        }`}
                                      >
                                        <span className={`text-[9px] font-mono font-bold ${isSel ? 'text-[#E31B23]' : 'text-[#555]'}`}>
                                          {step.num} · {isSel ? 'ACTIVE' : 'OFF'}
                                        </span>
                                        <span className="text-[11px] font-['Syne'] font-bold uppercase mt-1">
                                          {step.title}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Edit 3 Metrics in ₹ */}
                              <div className="pt-2 border-t border-white/[0.05]">
                                <div className="text-[10px] font-mono text-[#E31B23] uppercase font-bold mb-1.5">
                                  EDIT 3 METRICS (IN ₹ RUPEES):
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {project.metrics.map((m, mIdx) => (
                                    <div key={mIdx} className="bg-[#141414] p-2 rounded-xs border border-white/10">
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">METRIC {mIdx + 1} (₹)</label>
                                      <input
                                        type="text"
                                        value={m.metric}
                                        onChange={(e) => {
                                          const newM = [...project.metrics];
                                          newM[mIdx] = { ...newM[mIdx], metric: e.target.value };
                                          updateProject(project.id, { metrics: newM });
                                        }}
                                        className="w-full bg-[#202020] border border-white/10 rounded-xs p-1.5 text-xs text-[#E31B23] font-bold mb-1 outline-none font-mono"
                                      />
                                      <input
                                        type="text"
                                        value={m.label}
                                        onChange={(e) => {
                                          const newM = [...project.metrics];
                                          newM[mIdx] = { ...newM[mIdx], label: e.target.value };
                                          updateProject(project.id, { metrics: newM });
                                        }}
                                        className="w-full bg-[#202020] border border-white/10 rounded-xs p-1.5 text-[10px] text-[#CCC] outline-none"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xs font-mono text-emerald-400">
                                  ✓ Live updates synchronized!
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditingProjectId(null)}
                                  className="px-5 py-2 bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-all shadow-[0_0_12px_rgba(227,27,35,0.4)]"
                                >
                                  Done Editing
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Header & Origin Labs Link Configuration */}
              {activeTab === 'header' && (
                <div className="space-y-6">
                  <div className="border-b border-white/[0.08] pb-3">
                    <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                      HEADER &amp; ORIGIN LABS REDIRECT LINK
                    </h4>
                    <div className="text-xs text-[#888] font-mono mt-0.5">
                      Configure the Origin Labs button in the top navigation header and destination redirect link
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono text-[#888] block mb-1">
                        ORIGIN LABS REDIRECT URL *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          required
                          value={draftContent.header.originLabsUrl}
                          onChange={(e) =>
                            setDraftContent({
                              ...draftContent,
                              header: { ...draftContent.header, originLabsUrl: e.target.value },
                            })
                          }
                          placeholder="https://originlabs.brandorigin.in"
                          className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none font-mono"
                        />
                        <a
                          href={draftContent.header.originLabsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2.5 bg-[#181818] hover:bg-[#222] border border-white/10 text-white rounded-xs text-xs font-mono flex items-center gap-1 shrink-0"
                          title="Test open destination link"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#E31B23]" />
                          <span>Test</span>
                        </a>
                      </div>
                      <div className="text-[10px] font-mono text-[#666] mt-1">
                        When users click &quot;Origin Labs&quot; in the header, they will be redirected to this link.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono text-[#888] block mb-1">
                          BUTTON LABEL
                        </label>
                        <input
                          type="text"
                          value={draftContent.header.originLabsLabel}
                          onChange={(e) =>
                            setDraftContent({
                              ...draftContent,
                              header: { ...draftContent.header, originLabsLabel: e.target.value },
                            })
                          }
                          className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#888] block mb-1">
                          START PROJECT BUTTON LABEL
                        </label>
                        <input
                          type="text"
                          value={draftContent.header.startProjectLabel}
                          onChange={(e) =>
                            setDraftContent({
                              ...draftContent,
                              header: { ...draftContent.header, startProjectLabel: e.target.value },
                            })
                          }
                          className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                    <span className="text-xs font-mono text-emerald-400">
                      {saveSuccess && '✓ Origin Labs Link updated!'}
                    </span>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      Save Header Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Hero Content */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="border-b border-white/[0.08] pb-3">
                    <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                      HERO SECTION CONTENT
                    </h4>
                    <div className="text-xs text-[#888] font-mono mt-0.5">
                      Controls the main greeting, headlines, and calls-to-action
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-[#888] block mb-1">
                        HEADLINE LINE 1
                      </label>
                      <input
                        type="text"
                        value={draftContent.hero.headlineLine1}
                        onChange={(e) =>
                          setDraftContent({
                            ...draftContent,
                            hero: { ...draftContent.hero, headlineLine1: e.target.value },
                          })
                        }
                        className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-[#888] block mb-1">
                        HEADLINE LINE 2
                      </label>
                      <input
                        type="text"
                        value={draftContent.hero.headlineLine2}
                        onChange={(e) =>
                          setDraftContent({
                            ...draftContent,
                            hero: { ...draftContent.hero, headlineLine2: e.target.value },
                          })
                        }
                        className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#888] block mb-1">
                      SUBHEADLINE MANIFESTO
                    </label>
                    <textarea
                      rows={2}
                      value={draftContent.hero.subheadline}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          hero: { ...draftContent.hero, subheadline: e.target.value },
                        })
                      }
                      className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-mono text-[#888] block mb-1">
                        PRIMARY CTA BUTTON
                      </label>
                      <input
                        type="text"
                        value={draftContent.hero.ctaPrimary}
                        onChange={(e) =>
                          setDraftContent({
                            ...draftContent,
                            hero: { ...draftContent.hero, ctaPrimary: e.target.value },
                          })
                        }
                        className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-[#888] block mb-1">
                        SECONDARY CTA BUTTON
                      </label>
                      <input
                        type="text"
                        value={draftContent.hero.ctaSecondary}
                        onChange={(e) =>
                          setDraftContent({
                            ...draftContent,
                            hero: { ...draftContent.hero, ctaSecondary: e.target.value },
                          })
                        }
                        className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-[#888] block mb-1">
                        BANNER BADGE
                      </label>
                      <input
                        type="text"
                        value={draftContent.hero.bannerBadge}
                        onChange={(e) =>
                          setDraftContent({
                            ...draftContent,
                            hero: { ...draftContent.hero, bannerBadge: e.target.value },
                          })
                        }
                        className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                    <span className="text-xs font-mono text-emerald-400">
                      {saveSuccess && '✓ Changes applied to live website!'}
                    </span>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      Save Hero Updates
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: Stage Headlines & Quotes */}
              {activeTab === 'stages' && (
                <div className="space-y-6">
                  <div className="border-b border-white/[0.08] pb-3">
                    <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                      STAGES CONTENT EDITORS
                    </h4>
                    <div className="text-xs text-[#888] font-mono mt-0.5">
                      Control the headlines and narrative statements across each numbered journey stage
                    </div>
                  </div>

                  {/* Stage 01 Idea */}
                  <div className="p-3 bg-[#111] border border-white/[0.05] rounded-xs space-y-2">
                    <div className="text-xs font-mono text-[#E31B23] font-bold">STAGE 01 · IDEA</div>
                    <input
                      type="text"
                      value={draftContent.idea.headline}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, idea: { ...draftContent.idea, headline: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-white font-bold"
                    />
                    <textarea
                      rows={2}
                      value={draftContent.idea.quote}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, idea: { ...draftContent.idea, quote: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-[#BBB]"
                    />
                  </div>

                  {/* Stage 02 Digital */}
                  <div className="p-3 bg-[#111] border border-white/[0.05] rounded-xs space-y-2">
                    <div className="text-xs font-mono text-[#E31B23] font-bold">STAGE 02 · DIGITAL IMMERSION</div>
                    <input
                      type="text"
                      value={draftContent.digital.headline}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, digital: { ...draftContent.digital, headline: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-white font-bold"
                      placeholder="Headline..."
                    />
                    <textarea
                      rows={2}
                      value={draftContent.digital.quote}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, digital: { ...draftContent.digital, quote: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-[#BBB]"
                      placeholder="Statement quote..."
                    />
                  </div>

                  {/* Stage 03 Performance */}
                  <div className="p-3 bg-[#111] border border-white/[0.05] rounded-xs space-y-2">
                    <div className="text-xs font-mono text-[#E31B23] font-bold">STAGE 03 · PERFORMANCE ENGINE</div>
                    <input
                      type="text"
                      value={draftContent.performance.headline}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, performance: { ...draftContent.performance, headline: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-white font-bold"
                      placeholder="Headline..."
                    />
                    <textarea
                      rows={2}
                      value={draftContent.performance.quote}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, performance: { ...draftContent.performance, quote: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-[#BBB]"
                      placeholder="Statement quote..."
                    />
                  </div>

                  {/* Stage 04 Footprint */}
                  <div className="p-3 bg-[#111] border border-white/[0.05] rounded-xs space-y-2">
                    <div className="text-xs font-mono text-[#E31B23] font-bold">STAGE 04 · THE INTERCONNECTED NETWORK</div>
                    <input
                      type="text"
                      value={draftContent.footprint.headline}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, footprint: { ...draftContent.footprint, headline: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-white font-bold"
                      placeholder="Headline..."
                    />
                    <textarea
                      rows={2}
                      value={draftContent.footprint.quote}
                      onChange={(e) =>
                        setDraftContent({ ...draftContent, footprint: { ...draftContent.footprint, quote: e.target.value } })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-[#BBB]"
                      placeholder="Statement quote..."
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                    <span className="text-xs font-mono text-emerald-400">
                      {saveSuccess && '✓ Changes applied to live website!'}
                    </span>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      Save Stage Headlines
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: Capabilities & Services Management (Add New / Edit / Reorder / Delete) */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div>
                      <h4 className="font-['Syne'] text-xl font-bold text-white uppercase flex items-center gap-2">
                        <span>CAPABILITIES &amp; SERVICES MANAGEMENT</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#E31B23]/20 text-[#E31B23] border border-[#E31B23]/40">
                          {(content.services || []).length} ACTIVE
                        </span>
                      </h4>
                      <div className="text-xs text-[#888] font-mono mt-0.5">
                        Add new service disciplines, update offerings, re-sequence display order, and configure commercial impact metrics (in ₹)
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddingService(!isAddingService)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingService ? 'Cancel Form' : '+ Add New Service'}</span>
                    </button>
                  </div>

                  {/* Add New Service Form */}
                  {isAddingService && (
                    <form onSubmit={handleCreateService} className="p-5 sm:p-6 bg-[#121212] border border-[#E31B23]/60 rounded-xs space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-xs font-mono text-[#E31B23] font-bold uppercase">
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>PUBLISH NEW SERVICE TO LIVE ECOSYSTEM</span>
                        </span>
                        <button type="button" onClick={() => setIsAddingService(false)} className="text-[#888] hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-[#AAA] block mb-1">SERVICE TITLE *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AI Integration & Autonomous Systems"
                            value={newServiceForm.title}
                            onChange={(e) => setNewServiceForm({ ...newServiceForm, title: e.target.value })}
                            className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-mono text-[#AAA]">STAGE CATEGORY *</label>
                            <div className="flex items-center gap-1 text-[9px] font-mono text-[#777]">
                              {['Genesis Stage', 'Digital Stage', 'Ecosystem Stage'].map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setNewServiceForm({ ...newServiceForm, category: cat })}
                                  className="text-[#E31B23] hover:underline"
                                >
                                  {cat.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Genesis Stage / Digital Stage"
                            value={newServiceForm.category}
                            onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                            className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#AAA] block mb-1">SERVICE DESCRIPTION *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Comprehensive description of the architectural methodology, engineered value, and execution discipline..."
                          value={newServiceForm.description}
                          onChange={(e) => setNewServiceForm({ ...newServiceForm, description: e.target.value })}
                          className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-[#AAA] block mb-1">
                            KEY DELIVERABLES (COMMA SEPARATED)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. AI Strategy, Custom Shaders, Edge Models, Security Audit"
                            value={newServiceForm.deliverablesText}
                            onChange={(e) => setNewServiceForm({ ...newServiceForm, deliverablesText: e.target.value })}
                            className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-[#AAA] block mb-1">
                            MEASURABLE COMMERCIAL IMPACT METRIC (₹) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 4.2x Faster Conversion / ₹20 Cr Cost Reduction"
                            value={newServiceForm.impactMetric}
                            onChange={(e) => setNewServiceForm({ ...newServiceForm, impactMetric: e.target.value })}
                            className="w-full bg-[#181818] border border-white/10 focus:border-[#E31B23] rounded-xs p-2 text-xs text-[#E31B23] font-mono font-bold outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_18px_rgba(227,27,35,0.4)] flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publish New Service to Live Website</span>
                      </button>
                    </form>
                  )}

                  {/* List of Existing Services with Move Up / Move Down / Delete / Edit */}
                  <div className="space-y-4">
                    {(content.services || []).map((srv, idx) => {
                      const isEditing = editingServiceId === srv.id;
                      return (
                        <div
                          key={srv.id || idx}
                          className="p-4 sm:p-5 bg-[#111111] border border-white/[0.08] hover:border-white/[0.16] rounded-sm space-y-3 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.05] pb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xs bg-[#1a1112] border border-[#E31B23]/40 text-[#E31B23] shrink-0 font-mono">
                                <span className="text-[9px] uppercase font-light">POS</span>
                                <span className="text-sm font-bold leading-none">{srv.number}</span>
                              </div>
                              <div>
                                <div className="font-['Syne'] text-base font-bold text-white uppercase flex items-center gap-2">
                                  <span>{srv.title}</span>
                                </div>
                                <div className="text-[10px] font-mono text-[#777] flex items-center gap-2 mt-0.5">
                                  <span className="text-[#E31B23]">{srv.category}</span>
                                  <span>·</span>
                                  <span>Impact: {srv.impactMetric}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center flex-wrap gap-1.5 self-end sm:self-auto">
                              {/* Move Up */}
                              <button
                                onClick={() => moveServiceUp(idx)}
                                disabled={idx === 0}
                                className={`px-2.5 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
                                  idx === 0
                                    ? 'opacity-25 border-white/5 text-[#555] cursor-not-allowed'
                                    : 'border-white/15 text-white hover:bg-[#1a1112] hover:border-[#E31B23] text-[#E31B23]'
                                }`}
                                title="Move service up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                                <span>Move Up</span>
                              </button>

                              {/* Move Down */}
                              <button
                                onClick={() => moveServiceDown(idx)}
                                disabled={idx === (content.services || []).length - 1}
                                className={`px-2.5 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
                                  idx === (content.services || []).length - 1
                                    ? 'opacity-25 border-white/5 text-[#555] cursor-not-allowed'
                                    : 'border-white/15 text-white hover:bg-[#1a1112] hover:border-[#E31B23] text-[#E31B23]'
                                }`}
                                title="Move service down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                                <span>Move Down</span>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => setEditingServiceId(isEditing ? null : srv.id)}
                                className={`px-3 py-1.5 rounded-xs border text-xs font-mono flex items-center gap-1.5 transition-all ${
                                  isEditing
                                    ? 'bg-[#E31B23] text-white border-[#E31B23]'
                                    : 'bg-[#181818] hover:bg-[#202020] border-white/15 text-white'
                                }`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>{isEditing ? 'Close' : 'Edit'}</span>
                              </button>

                              {/* Delete Service Button */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to permanently delete service "${srv.title}" from the website?`)) {
                                    deleteService(srv.id);
                                    if (editingServiceId === srv.id) {
                                      setEditingServiceId(null);
                                    }
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-950 border border-red-500/40 hover:border-red-500 text-red-200 rounded-xs text-xs font-mono flex items-center gap-1 transition-all"
                                title="Delete service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-[#CCC] font-light leading-relaxed">
                            {srv.description}
                          </div>

                          {srv.deliverables && srv.deliverables.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {srv.deliverables.map((del, dIdx) => (
                                <span
                                  key={dIdx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#181818] border border-white/10 text-[#BBB]"
                                >
                                  {del}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Full Inline Edit Form */}
                          {isEditing && (
                            <div className="p-4 sm:p-5 bg-[#0a0a0a] border border-[#E31B23]/50 rounded-xs space-y-3 mt-3 animate-in fade-in duration-200">
                              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                                <div className="text-xs font-mono text-[#E31B23] font-bold uppercase flex items-center gap-2">
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>EDITING SERVICE: {srv.title}</span>
                                </div>
                                <span className="text-[10px] font-mono text-[#777]">CHANGES AUTO-SAVE TO LIVE SITE</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[9px] font-mono text-[#888] block mb-1">SERVICE TITLE</label>
                                  <input
                                    type="text"
                                    value={srv.title}
                                    onChange={(e) => updateService(srv.id, { title: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-mono text-[#888] block mb-1">CATEGORY</label>
                                  <input
                                    type="text"
                                    value={srv.category}
                                    onChange={(e) => updateService(srv.id, { category: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-mono text-[#888] block mb-1">DESCRIPTION</label>
                                <textarea
                                  rows={2}
                                  value={srv.description}
                                  onChange={(e) => updateService(srv.id, { description: e.target.value })}
                                  className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-[#CCC] outline-none resize-none focus:border-[#E31B23]"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[9px] font-mono text-[#888] block mb-1">
                                    DELIVERABLES (COMMA SEPARATED)
                                  </label>
                                  <input
                                    type="text"
                                    value={srv.deliverables?.join(', ') || ''}
                                    onChange={(e) =>
                                      updateService(srv.id, {
                                        deliverables: e.target.value
                                          .split(',')
                                          .map((s) => s.trim())
                                          .filter(Boolean),
                                      })
                                    }
                                    className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-mono text-[#888] block mb-1">
                                    MEASURABLE IMPACT METRIC (₹)
                                  </label>
                                  <input
                                    type="text"
                                    value={srv.impactMetric}
                                    onChange={(e) => updateService(srv.id, { impactMetric: e.target.value })}
                                    className="w-full bg-[#141414] border border-white/10 rounded-xs p-2 text-xs text-[#E31B23] font-mono font-bold outline-none focus:border-[#E31B23]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 7: Performance Steps */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="border-b border-white/[0.08] pb-3">
                    <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                      PERFORMANCE &amp; VELOCITY STEPS
                    </h4>
                    <div className="text-xs text-[#888] font-mono mt-0.5">
                      Adjust the 5 exponential milestone steps and revenue run-rates in Indian Rupees (₹)
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#888] block mb-1">
                      HEADLINE
                    </label>
                    <input
                      type="text"
                      value={draftContent.performance.headline}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          performance: { ...draftContent.performance, headline: e.target.value },
                        })
                      }
                      className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-[#888] uppercase">
                      5 STEP COUNTERS (IN RUPEES / VOLUME):
                    </div>
                    {draftContent.performance.counterSteps.map((step, idx) => (
                      <div key={idx} className="p-3 bg-[#121212] border border-white/[0.06] rounded-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-mono text-[#777] block mb-1">STAGE NAME</label>
                          <input
                            type="text"
                            value={step.label}
                            onChange={(e) => {
                              const updated = [...draftContent.performance.counterSteps];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                performance: { ...draftContent.performance, counterSteps: updated },
                              });
                            }}
                            className="w-full bg-[#181818] border border-white/10 rounded-xs px-2.5 py-1 text-xs text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[#777] block mb-1">METRIC VALUE (₹)</label>
                          <input
                            type="text"
                            value={step.value}
                            onChange={(e) => {
                              const updated = [...draftContent.performance.counterSteps];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                performance: { ...draftContent.performance, counterSteps: updated },
                              });
                            }}
                            className="w-full bg-[#181818] border border-white/10 rounded-xs px-2.5 py-1 text-xs text-[#E31B23] font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-[#777] block mb-1">UNIT / FREQUENCY</label>
                          <input
                            type="text"
                            value={step.unit}
                            onChange={(e) => {
                              const updated = [...draftContent.performance.counterSteps];
                              updated[idx] = { ...updated[idx], unit: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                performance: { ...draftContent.performance, counterSteps: updated },
                              });
                            }}
                            className="w-full bg-[#181818] border border-white/10 rounded-xs px-2.5 py-1 text-xs text-[#888] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                    <span className="text-xs font-mono text-emerald-400">
                      {saveSuccess && '✓ Changes applied to live website!'}
                    </span>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      Save Performance Updates
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 8: About & Tenets */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="border-b border-white/[0.08] pb-3">
                    <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                      ABOUT BRAND ORIGIN &amp; TENETS
                    </h4>
                    <div className="text-xs text-[#888] font-mono mt-0.5">
                      Controls agency philosophy statement and 4 foundational tenets
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#888] block mb-1">
                      ABOUT HEADLINE
                    </label>
                    <input
                      type="text"
                      value={draftContent.about.headline}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          about: { ...draftContent.about, headline: e.target.value },
                        })
                      }
                      className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#888] block mb-1">
                      PHILOSOPHY STATEMENT QUOTE
                    </label>
                    <textarea
                      rows={2}
                      value={draftContent.about.quote}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          about: { ...draftContent.about, quote: e.target.value },
                        })
                      }
                      className="w-full bg-[#121212] border border-white/[0.1] focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="text-[11px] font-mono text-[#888] uppercase">
                      FOUR ARCHITECTURAL TENETS:
                    </div>
                    {draftContent.about.tenets.map((tenet, idx) => (
                      <div key={idx} className="p-3 bg-[#121212] border border-white/[0.05] rounded-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#E31B23] font-bold">
                            TENET // {tenet.num}
                          </span>
                          <input
                            type="text"
                            value={tenet.title}
                            onChange={(e) => {
                              const newTenets = [...draftContent.about.tenets];
                              newTenets[idx] = { ...newTenets[idx], title: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                about: { ...draftContent.about, tenets: newTenets },
                              });
                            }}
                            className="bg-[#181818] border border-white/10 rounded-xs px-2.5 py-1 text-xs text-white flex-1 outline-none"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={tenet.desc}
                          onChange={(e) => {
                            const newTenets = [...draftContent.about.tenets];
                            newTenets[idx] = { ...newTenets[idx], desc: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              about: { ...draftContent.about, tenets: newTenets },
                            });
                          }}
                          className="w-full bg-[#181818] border border-white/10 rounded-xs p-2 text-xs text-[#CCC] outline-none resize-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/[0.08]">
                    <span className="text-xs font-mono text-emerald-400">
                      {saveSuccess && '✓ Changes applied to live website!'}
                    </span>
                    <button
                      onClick={handleSaveContent}
                      className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.4)]"
                    >
                      Save About Updates
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 9: Careers & Openings Management */}
              {activeTab === 'careers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div>
                      <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                        CAREERS &amp; OPENINGS MANAGEMENT
                      </h4>
                      <div className="text-xs text-[#888] font-mono mt-0.5">
                        Publish new job openings to the dedicated Careers page and review incoming candidate applications
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCareersSubTab('openings')}
                        className={`px-3 py-1.5 text-xs font-mono uppercase rounded-xs transition-colors cursor-pointer ${
                          careersSubTab === 'openings'
                            ? 'bg-[#E31B23] text-white font-semibold'
                            : 'bg-[#141414] text-[#999] hover:text-white border border-white/10'
                        }`}
                      >
                        Openings ({careersList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCareersSubTab('applications')}
                        className={`px-3 py-1.5 text-xs font-mono uppercase rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                          careersSubTab === 'applications'
                            ? 'bg-[#E31B23] text-white font-semibold'
                            : 'bg-[#141414] text-[#999] hover:text-white border border-white/10'
                        }`}
                      >
                        <span>Applications ({careerApplicationsList.length})</span>
                        {newApplicationsCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-white text-[#E31B23] text-[10px] font-bold flex items-center justify-center">
                            {newApplicationsCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {formNotice && (
                    <div className="p-3 bg-amber-950/50 border border-amber-500/40 rounded-xs text-xs font-mono text-amber-200 flex items-center justify-between">
                      <span>{formNotice}</span>
                      <button
                        type="button"
                        onClick={() => setFormNotice('')}
                        className="text-amber-300 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {careersSubTab === 'openings' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono text-[#999]">
                          ACTIVE ROLES ON CAREERS PAGE:{' '}
                          <strong className="text-white">
                            {careersList.filter((c) => c.status === 'active').length}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCareer(!isAddingCareer);
                            setFormNotice('');
                          }}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAddingCareer ? 'Cancel' : 'Add New Opening'}</span>
                        </button>
                      </div>

                      {/* Add New Career Opening Form */}
                      {isAddingCareer && (
                        <form
                          onSubmit={handleCreateCareerOpening}
                          className="p-5 bg-[#111113] border border-[#E31B23]/50 rounded-xs space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                            <span className="font-['Syne'] text-sm font-bold text-white uppercase">
                              Publish New Career Opening
                            </span>
                            <span className="text-[10px] font-mono text-[#E31B23]">
                              INSTANTLY LIVE ON /CAREERS
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                ROLE TITLE *
                              </label>
                              <input
                                type="text"
                                required
                                value={newCareerForm.title}
                                onChange={(e) =>
                                  setNewCareerForm({ ...newCareerForm, title: e.target.value })
                                }
                                placeholder="e.g., Principal Brand Identity Designer"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                DEPARTMENT / POD *
                              </label>
                              <input
                                type="text"
                                required
                                value={newCareerForm.department}
                                onChange={(e) =>
                                  setNewCareerForm({ ...newCareerForm, department: e.target.value })
                                }
                                placeholder="e.g., Identity & Design, Creative Engineering, Growth"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                LOCATION
                              </label>
                              <input
                                type="text"
                                value={newCareerForm.location}
                                onChange={(e) =>
                                  setNewCareerForm({ ...newCareerForm, location: e.target.value })
                                }
                                placeholder="Bengaluru · Hybrid"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                EMPLOYMENT TYPE
                              </label>
                              <input
                                type="text"
                                value={newCareerForm.type}
                                onChange={(e) =>
                                  setNewCareerForm({ ...newCareerForm, type: e.target.value })
                                }
                                placeholder="Full-Time"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                EXPERIENCE
                              </label>
                              <input
                                type="text"
                                value={newCareerForm.experience}
                                onChange={(e) =>
                                  setNewCareerForm({ ...newCareerForm, experience: e.target.value })
                                }
                                placeholder="3–6 Years"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                COMPENSATION (₹ INR)
                              </label>
                              <input
                                type="text"
                                value={newCareerForm.compensation}
                                onChange={(e) =>
                                  setNewCareerForm({ ...newCareerForm, compensation: e.target.value })
                                }
                                placeholder="₹18L – ₹28L / yr"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-[#888] block mb-1">
                              ROLE SUMMARY / OVERVIEW *
                            </label>
                            <textarea
                              rows={2}
                              required
                              value={newCareerForm.summary}
                              onChange={(e) =>
                                setNewCareerForm({ ...newCareerForm, summary: e.target.value })
                              }
                              placeholder="Concise overview of what this role builds and owns at Brand Origin..."
                              className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                KEY RESPONSIBILITIES (ONE PER LINE)
                              </label>
                              <textarea
                                rows={4}
                                value={newCareerForm.responsibilitiesText}
                                onChange={(e) =>
                                  setNewCareerForm({
                                    ...newCareerForm,
                                    responsibilitiesText: e.target.value,
                                  })
                                }
                                placeholder={`Lead end-to-end visual identity systems\nArchitect comprehensive brand guidelines\nCollaborate with 3D and motion engineers`}
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                CRAFT &amp; EXPERIENCE REQUIREMENTS (ONE PER LINE)
                              </label>
                              <textarea
                                rows={4}
                                value={newCareerForm.requirementsText}
                                onChange={(e) =>
                                  setNewCareerForm({
                                    ...newCareerForm,
                                    requirementsText: e.target.value,
                                  })
                                }
                                placeholder={`4+ years crafting identity systems for ambitious ventures\nMastery of typography, grid systems, and motion principles\nPortfolio demonstrating commercial brand launches`}
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingCareer(false)}
                              className="px-4 py-2 text-xs font-mono text-[#888] hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all cursor-pointer"
                            >
                              Publish Opening
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Existing Career Openings List */}
                      <div className="space-y-3">
                        {careersList.map((role, index) => {
                          const isEditing = editingCareerId === role.id;
                          return (
                            <div
                              key={role.id}
                              className="p-4 sm:p-5 bg-[#101012] border border-white/[0.08] rounded-xs space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#888]">
                                    <span className="text-[#E31B23] font-bold">
                                      #{String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-white">{role.department}</span>
                                    <span>·</span>
                                    <span>{role.location}</span>
                                    <span>·</span>
                                    <span>{role.type}</span>
                                    <span>·</span>
                                    <span className="text-zinc-300">{role.compensation}</span>
                                  </div>
                                  <div className="font-['Syne'] text-base sm:text-lg font-bold text-white">
                                    {role.title}
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateCareerOpening(role.id, {
                                        status: role.status === 'active' ? 'closed' : 'active',
                                      })
                                    }
                                    className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs border cursor-pointer transition-colors ${
                                      role.status === 'active'
                                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                                        : 'bg-zinc-900 border-white/10 text-zinc-400'
                                    }`}
                                  >
                                    {role.status === 'active' ? '● Active' : '○ Closed'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveCareerOpeningUp(index)}
                                    disabled={index === 0}
                                    className="p-1.5 bg-[#181818] hover:bg-[#222] disabled:opacity-30 text-white rounded-xs cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveCareerOpeningDown(index)}
                                    disabled={index === careersList.length - 1}
                                    className="p-1.5 bg-[#181818] hover:bg-[#222] disabled:opacity-30 text-white rounded-xs cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingCareerId(isEditing ? null : role.id)
                                    }
                                    className="px-2.5 py-1 bg-[#181818] hover:bg-[#242424] text-xs font-mono text-white rounded-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit2 className="w-3 h-3 text-[#E31B23]" />
                                    <span>{isEditing ? 'Done' : 'Edit'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteCareerOpening(role.id)}
                                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xs cursor-pointer"
                                    title="Delete Opening"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {!isEditing && (
                                <p className="text-xs text-[#999] leading-relaxed">
                                  {role.summary}
                                </p>
                              )}

                              {isEditing && (
                                <div className="pt-3 border-t border-white/[0.08] space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        ROLE TITLE
                                      </label>
                                      <input
                                        type="text"
                                        value={role.title}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, { title: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        DEPARTMENT
                                      </label>
                                      <input
                                        type="text"
                                        value={role.department}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, {
                                            department: e.target.value,
                                          })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        LOCATION
                                      </label>
                                      <input
                                        type="text"
                                        value={role.location}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, { location: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        TYPE
                                      </label>
                                      <input
                                        type="text"
                                        value={role.type}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, { type: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        EXPERIENCE
                                      </label>
                                      <input
                                        type="text"
                                        value={role.experience}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, {
                                            experience: e.target.value,
                                          })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        COMPENSATION (₹)
                                      </label>
                                      <input
                                        type="text"
                                        value={role.compensation}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, {
                                            compensation: e.target.value,
                                          })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-mono text-[#888] block mb-1">
                                      SUMMARY
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={role.summary}
                                      onChange={(e) =>
                                        updateCareerOpening(role.id, { summary: e.target.value })
                                      }
                                      className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none resize-none focus:border-[#E31B23]"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        RESPONSIBILITIES (ONE PER LINE)
                                      </label>
                                      <textarea
                                        rows={4}
                                        value={(role.responsibilities || []).join('\n')}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, {
                                            responsibilities: e.target.value
                                              .split('\n')
                                              .map((s) => s.trim())
                                              .filter(Boolean),
                                          })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none resize-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        REQUIREMENTS (ONE PER LINE)
                                      </label>
                                      <textarea
                                        rows={4}
                                        value={(role.requirements || []).join('\n')}
                                        onChange={(e) =>
                                          updateCareerOpening(role.id, {
                                            requirements: e.target.value
                                              .split('\n')
                                              .map((s) => s.trim())
                                              .filter(Boolean),
                                          })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none resize-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Candidate Applications Sub-Tab */
                    <div className="space-y-4">
                      {careerApplicationsList.length === 0 ? (
                        <div className="text-center py-14 border border-dashed border-white/10 rounded-xs">
                          <Briefcase className="w-9 h-9 text-[#666] mx-auto mb-2" />
                          <div className="text-sm text-[#888] font-mono">
                            No candidate applications submitted yet.
                          </div>
                        </div>
                      ) : (
                        careerApplicationsList.map((app) => (
                          <div
                            key={app.id}
                            className="p-4 sm:p-5 bg-[#101012] border border-white/[0.08] rounded-xs space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                              <div>
                                <div className="text-[11px] font-mono text-[#E31B23] uppercase">
                                  {app.openingTitle} · {app.department}
                                </div>
                                <div className="font-['Syne'] text-base font-bold text-white mt-0.5">
                                  {app.name}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <select
                                  value={app.status}
                                  onChange={(e) =>
                                    updateCareerApplicationStatus(
                                      app.id,
                                      e.target.value as any
                                    )
                                  }
                                  className="bg-[#18181b] border border-white/15 rounded-xs px-2.5 py-1 text-xs font-mono text-white outline-none"
                                >
                                  <option value="new">● New</option>
                                  <option value="reviewing">◐ Reviewing</option>
                                  <option value="shortlisted">★ Shortlisted</option>
                                  <option value="closed">✕ Closed</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => deleteCareerApplication(app.id)}
                                  className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xs cursor-pointer"
                                  title="Delete Application"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[#AAA]">
                              <div>
                                <span className="text-[#666]">EMAIL: </span>
                                <a
                                  href={`mailto:${app.email}`}
                                  className="text-white hover:underline"
                                >
                                  {app.email}
                                </a>
                              </div>
                              <div>
                                <span className="text-[#666]">PHONE: </span>
                                <span className="text-white">{app.phone}</span>
                              </div>
                              <div>
                                <span className="text-[#666]">EXPERIENCE: </span>
                                <span className="text-white">{app.experience}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                              <div className="truncate max-w-full">
                                <span className="text-[#666]">PORTFOLIO: </span>
                                <a
                                  href={app.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#E31B23] hover:underline break-all"
                                >
                                  {app.portfolioUrl}
                                </a>
                              </div>
                              <span className="text-[#666]">{app.createdAt}</span>
                            </div>

                            {app.coverNote && (
                              <div className="p-3 bg-[#151518] border border-white/[0.05] rounded-xs text-xs text-[#CCC] leading-relaxed">
                                {app.coverNote}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 10: Owner's Blog & Owner Profile/Image Management */}
              {activeTab === 'blog' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div>
                      <h4 className="font-['Syne'] text-xl font-bold text-white uppercase">
                        OWNER&apos;S BLOG — ABOUT OUR OWNER &amp; PHOTO
                      </h4>
                      <div className="text-xs text-[#888] font-mono mt-0.5">
                        Upload the Owner&apos;s photo, edit content about our owner, and manage additional founder stories on /blog
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBlogSubTab('owner')}
                        className={`px-3 py-1.5 text-xs font-mono uppercase rounded-xs transition-colors cursor-pointer ${
                          blogSubTab === 'owner'
                            ? 'bg-[#E31B23] text-white font-semibold'
                            : 'bg-[#141414] text-[#999] hover:text-white border border-white/10'
                        }`}
                      >
                        About Owner &amp; Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlogSubTab('posts')}
                        className={`px-3 py-1.5 text-xs font-mono uppercase rounded-xs transition-colors cursor-pointer ${
                          blogSubTab === 'posts'
                            ? 'bg-[#E31B23] text-white font-semibold'
                            : 'bg-[#141414] text-[#999] hover:text-white border border-white/10'
                        }`}
                      >
                        Additional Stories ({ownerBlogsList.length})
                      </button>
                    </div>
                  </div>

                  {formNotice && (
                    <div className="p-3 bg-amber-950/50 border border-amber-500/40 rounded-xs text-xs font-mono text-amber-200 flex items-center justify-between">
                      <span>{formNotice}</span>
                      <button
                        type="button"
                        onClick={() => setFormNotice('')}
                        className="text-amber-300 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Quick Owner Portrait & Profile Card Always Accessible at Top */}
                  <div className="p-4 sm:p-5 bg-[#101013] border border-white/[0.1] rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-xs overflow-hidden border border-[#E31B23]/50 bg-[#18181b] shrink-0 flex items-center justify-center">
                        {hasUploadedOwnerPhoto ? (
                          <img
                            src={ownerProfileData.image}
                            alt={ownerProfileData.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-[10px] font-mono text-[#E31B23] text-center px-1 leading-tight">
                            OWNER
                            <br />
                            PHOTO
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#E31B23]">
                          OUR OWNER &amp; FOUNDER PORTRAIT
                        </div>
                        <div className="font-['Syne'] text-base font-bold text-white mt-0.5">
                          {ownerProfileData.name}
                        </div>
                        <div className="text-xs font-mono text-[#888]">
                          {ownerProfileData.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={ownerPhotoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadOwnerProfilePhoto(file);
                          e.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => ownerPhotoInputRef.current?.click()}
                        className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>{hasUploadedOwnerPhoto ? 'Change Owner Photo' : 'Upload Owner Photo'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBlogSubTab(blogSubTab === 'owner' ? 'posts' : 'owner')}
                        className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-[#BBB] hover:text-white bg-[#141416] border border-white/10 rounded-xs transition-colors cursor-pointer"
                      >
                        {blogSubTab === 'owner' ? 'Manage Additional Stories' : 'Edit About Owner Content'}
                      </button>
                    </div>
                  </div>

                  {blogSubTab === 'owner' ? (
                    /* Sub-Tab: About Our Owner & Portrait Photo Editor */
                    <div className="p-5 bg-[#101012] border border-white/[0.08] rounded-xs space-y-4">
                      <div className="border-b border-white/[0.08] pb-2.5 flex items-center justify-between">
                        <span className="font-['Syne'] text-sm font-bold text-white uppercase">
                          Content About Our Owner &amp; Owner Photo
                        </span>
                        {saveSuccess && (
                          <span className="text-xs font-mono text-emerald-400">
                            ✓ Saved to live website
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono text-[#888] block mb-1">
                            OWNER NAME
                          </label>
                          <input
                            type="text"
                            value={ownerProfileData.name}
                            onChange={(e) => updateOwnerProfile({ name: e.target.value })}
                            placeholder="Founder & Managing Director"
                            className="w-full bg-[#161618] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-[#888] block mb-1">
                            OWNER ROLE / DESIGNATION
                          </label>
                          <input
                            type="text"
                            value={ownerProfileData.role}
                            onChange={(e) => updateOwnerProfile({ role: e.target.value })}
                            placeholder="Founder & Principal Architect · Brand Origin"
                            className="w-full bg-[#161618] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#888] block mb-1">
                          PAGE HEADLINE (ABOUT OUR OWNER)
                        </label>
                        <input
                          type="text"
                          value={ownerProfileData.headline}
                          onChange={(e) => updateOwnerProfile({ headline: e.target.value })}
                          placeholder="THE VISION & LEADERSHIP BEHIND BRAND ORIGIN."
                          className="w-full bg-[#161618] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#888] block mb-1">
                          OWNER PHOTO (UPLOAD FROM COMPUTER OR PASTE IMAGE URL)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={ownerProfileData.image}
                            onChange={(e) => updateOwnerProfile({ image: e.target.value })}
                            placeholder="Paste Owner Photo URL or click Upload Photo from System..."
                            className="flex-1 bg-[#161618] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => ownerPhotoInputRef.current?.click()}
                            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo from System</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#888] block mb-1">
                          SIGNATURE OWNER QUOTE
                        </label>
                        <textarea
                          rows={2}
                          value={ownerProfileData.quote}
                          onChange={(e) => updateOwnerProfile({ quote: e.target.value })}
                          className="w-full bg-[#161618] border border-white/10 focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-y"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-[#888] block mb-1">
                          CONTENT ABOUT OUR OWNER (FULL BIOGRAPHY &amp; STORY — SEPARATE PARAGRAPHS WITH BLANK LINES)
                        </label>
                        <textarea
                          rows={8}
                          value={ownerProfileData.bio}
                          onChange={(e) => updateOwnerProfile({ bio: e.target.value })}
                          className="w-full bg-[#161618] border border-white/10 focus:border-[#E31B23] rounded-xs p-3 text-xs text-white outline-none resize-y leading-relaxed"
                        />
                      </div>

                      <div className="pt-2 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-mono text-emerald-400">
                          {saveSuccess ? '✓ Saved to live website!' : 'Changes sync automatically to /blog'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            updateOwnerProfile(ownerProfileData);
                            setSaveSuccess(true);
                            setTimeout(() => setSaveSuccess(false), 2500);
                          }}
                          className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all shadow-[0_0_15px_rgba(227,27,35,0.35)] flex items-center gap-2 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Owner Content</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Sub-Tab: Additional Owner Stories / Sections Management */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-mono text-[#999]">
                          PUBLISHED OWNER STORIES ON /BLOG:{' '}
                          <strong className="text-white">
                            {ownerBlogsList.filter((b) => b.status === 'published').length}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingBlog(!isAddingBlog);
                            setFormNotice('');
                          }}
                          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAddingBlog ? 'Cancel' : 'Add Owner Story Section'}</span>
                        </button>
                      </div>

                      {/* Add New Blog Post Form */}
                      {isAddingBlog && (
                        <form
                          onSubmit={handleCreateOwnerBlog}
                          className="p-5 bg-[#111113] border border-[#E31B23]/50 rounded-xs space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                            <span className="font-['Syne'] text-sm font-bold text-white uppercase">
                              Add New Content Section About Our Owner
                            </span>
                            <span className="text-[10px] font-mono text-[#E31B23]">
                              INSTANTLY LIVE ON /BLOG
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                SECTION / STORY TITLE *
                              </label>
                              <input
                                type="text"
                                required
                                value={newBlogForm.title}
                                onChange={(e) =>
                                  setNewBlogForm({ ...newBlogForm, title: e.target.value })
                                }
                                placeholder="e.g., The Founder’s Journey: Why I Built Brand Origin"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-[#888] block mb-1">
                                CATEGORY / LABEL
                              </label>
                              <input
                                type="text"
                                value={newBlogForm.category}
                                onChange={(e) =>
                                  setNewBlogForm({ ...newBlogForm, category: e.target.value })
                                }
                                placeholder="Founder Story"
                                className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                              />
                            </div>
                          </div>

                          {/* Owner Details & Owner Image for this Blog Post */}
                          <div className="p-3.5 bg-[#151519] border border-white/[0.08] rounded-xs space-y-3">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-[#E31B23]">
                              SECTION PHOTO &amp; METADATA (OPTIONAL)
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="text-[10px] font-mono text-[#888] block mb-1">
                                  OWNER NAME (OPTIONAL OVERRIDE)
                                </label>
                                <input
                                  type="text"
                                  value={newBlogForm.ownerName}
                                  onChange={(e) =>
                                    setNewBlogForm({ ...newBlogForm, ownerName: e.target.value })
                                  }
                                  placeholder={ownerProfileData.name}
                                  className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-mono text-[#888] block mb-1">
                                  OWNER ROLE (OPTIONAL OVERRIDE)
                                </label>
                                <input
                                  type="text"
                                  value={newBlogForm.ownerRole}
                                  onChange={(e) =>
                                    setNewBlogForm({ ...newBlogForm, ownerRole: e.target.value })
                                  }
                                  placeholder={ownerProfileData.role}
                                  className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-mono text-[#888] block mb-1">
                                  SUBTITLE / TAG
                                </label>
                                <input
                                  type="text"
                                  value={newBlogForm.readTime}
                                  onChange={(e) =>
                                    setNewBlogForm({ ...newBlogForm, readTime: e.target.value })
                                  }
                                  placeholder="Origin Story"
                                  className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {/* Upload Owner Image for Blog */}
                              <div>
                                <label className="text-[10px] font-mono text-[#888] block mb-1">
                                  OWNER PHOTO FOR THIS SECTION (OPTIONAL)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newBlogForm.ownerImage}
                                    onChange={(e) =>
                                      setNewBlogForm({ ...newBlogForm, ownerImage: e.target.value })
                                    }
                                    placeholder="Paste image URL or upload..."
                                    className="flex-1 bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                                  />
                                  <input
                                    ref={newBlogOwnerPhotoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const dataUrl = await readAndCompressImage(file);
                                          setNewBlogForm((prev) => ({
                                            ...prev,
                                            ownerImage: dataUrl,
                                          }));
                                        } catch {
                                          setFormNotice('Failed to process owner image.');
                                        }
                                      }
                                      e.target.value = '';
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => newBlogOwnerPhotoInputRef.current?.click()}
                                    className="px-3 py-2 text-xs font-mono text-white bg-[#222228] hover:bg-[#2c2c34] border border-white/15 rounded-xs flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-[#E31B23]" />
                                    <span>Owner Photo</span>
                                  </button>
                                </div>
                              </div>

                              {/* Upload Article Cover Image */}
                              <div>
                                <label className="text-[10px] font-mono text-[#888] block mb-1">
                                  ADDITIONAL PHOTO (OPTIONAL)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newBlogForm.coverImage}
                                    onChange={(e) =>
                                      setNewBlogForm({ ...newBlogForm, coverImage: e.target.value })
                                    }
                                    placeholder="Paste image URL or upload..."
                                    className="flex-1 bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs px-3 py-2 text-xs text-white outline-none"
                                  />
                                  <input
                                    ref={newBlogCoverPhotoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const dataUrl = await readAndCompressImage(file);
                                          setNewBlogForm((prev) => ({
                                            ...prev,
                                            coverImage: dataUrl,
                                          }));
                                        } catch {
                                          setFormNotice('Failed to process image.');
                                        }
                                      }
                                      e.target.value = '';
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => newBlogCoverPhotoInputRef.current?.click()}
                                    className="px-3 py-2 text-xs font-mono text-white bg-[#222228] hover:bg-[#2c2c34] border border-white/15 rounded-xs flex items-center gap-1 shrink-0 cursor-pointer"
                                  >
                                    <ImageIcon className="w-3.5 h-3.5 text-[#E31B23]" />
                                    <span>Upload Photo</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-[#888] block mb-1">
                              LEAD HIGHLIGHT / SUMMARY SENTENCE
                            </label>
                            <textarea
                              rows={2}
                              value={newBlogForm.excerpt}
                              onChange={(e) =>
                                setNewBlogForm({ ...newBlogForm, excerpt: e.target.value })
                              }
                              placeholder="Short lead statement displayed under the section title..."
                              className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs p-2.5 text-xs text-white outline-none resize-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-[#888] block mb-1">
                              FULL CONTENT ABOUT OUR OWNER (SEPARATE PARAGRAPHS WITH BLANK LINES) *
                            </label>
                            <textarea
                              rows={7}
                              required
                              value={newBlogForm.content}
                              onChange={(e) =>
                                setNewBlogForm({ ...newBlogForm, content: e.target.value })
                              }
                              placeholder="Write the story or content about the owner here..."
                              className="w-full bg-[#18181b] border border-white/10 focus:border-[#E31B23] rounded-xs p-3 text-xs text-white outline-none resize-y"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingBlog(false)}
                              className="px-4 py-2 text-xs font-mono text-[#888] hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xs transition-all cursor-pointer"
                            >
                              Publish Section
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Existing Blog Posts List */}
                      <div className="space-y-3">
                        {ownerBlogsList.map((post, index) => {
                          const isEditing = editingBlogId === post.id;
                          const rawImg = post.coverImage || post.ownerImage || ownerProfileData.image;
                          const displayOwnerImg =
                            rawImg && !rawImg.includes('brand_origin_logo') ? rawImg : '';

                          return (
                            <div
                              key={post.id}
                              className="p-4 sm:p-5 bg-[#101012] border border-white/[0.08] rounded-xs space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {displayOwnerImg && (
                                    <img
                                      src={displayOwnerImg}
                                      alt={post.ownerName || ownerProfileData.name}
                                      referrerPolicy="no-referrer"
                                      className="w-11 h-11 rounded-xs object-cover border border-[#E31B23]/40 bg-[#18181b] shrink-0"
                                    />
                                  )}
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#888]">
                                      <span className="text-[#E31B23] font-bold">
                                        #{String(index + 1).padStart(2, '0')}
                                      </span>
                                      <span className="text-white">{post.category}</span>
                                      <span>·</span>
                                      <span>{post.publishedAt}</span>
                                      <span>·</span>
                                      <span>{post.readTime}</span>
                                    </div>
                                    <div className="font-['Syne'] text-base sm:text-lg font-bold text-white truncate">
                                      {post.title}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateOwnerBlog(post.id, {
                                        status:
                                          post.status === 'published' ? 'draft' : 'published',
                                      })
                                    }
                                    className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded-xs border cursor-pointer transition-colors ${
                                      post.status === 'published'
                                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                                        : 'bg-zinc-900 border-white/10 text-zinc-400'
                                    }`}
                                  >
                                    {post.status === 'published' ? '● Published' : '○ Draft'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveOwnerBlogUp(index)}
                                    disabled={index === 0}
                                    className="p-1.5 bg-[#181818] hover:bg-[#222] disabled:opacity-30 text-white rounded-xs cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => moveOwnerBlogDown(index)}
                                    disabled={index === ownerBlogsList.length - 1}
                                    className="p-1.5 bg-[#181818] hover:bg-[#222] disabled:opacity-30 text-white rounded-xs cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingBlogId(isEditing ? null : post.id)
                                    }
                                    className="px-2.5 py-1 bg-[#181818] hover:bg-[#242424] text-xs font-mono text-white rounded-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit2 className="w-3 h-3 text-[#E31B23]" />
                                    <span>{isEditing ? 'Done' : 'Edit'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteOwnerBlog(post.id)}
                                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xs cursor-pointer"
                                    title="Delete Blog Post"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {!isEditing && (
                                <p className="text-xs text-[#999] leading-relaxed">
                                  {post.excerpt}
                                </p>
                              )}

                              {isEditing && (
                                <div className="pt-3 border-t border-white/[0.08] space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        BLOG TITLE
                                      </label>
                                      <input
                                        type="text"
                                        value={post.title}
                                        onChange={(e) =>
                                          updateOwnerBlog(post.id, { title: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        CATEGORY
                                      </label>
                                      <input
                                        type="text"
                                        value={post.category}
                                        onChange={(e) =>
                                          updateOwnerBlog(post.id, { category: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        OWNER NAME
                                      </label>
                                      <input
                                        type="text"
                                        value={post.ownerName ?? ''}
                                        placeholder={ownerProfileData.name}
                                        onChange={(e) =>
                                          updateOwnerBlog(post.id, { ownerName: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        OWNER ROLE
                                      </label>
                                      <input
                                        type="text"
                                        value={post.ownerRole ?? ''}
                                        placeholder={ownerProfileData.role}
                                        onChange={(e) =>
                                          updateOwnerBlog(post.id, { ownerRole: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        READ TIME
                                      </label>
                                      <input
                                        type="text"
                                        value={post.readTime}
                                        onChange={(e) =>
                                          updateOwnerBlog(post.id, { readTime: e.target.value })
                                        }
                                        className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        OWNER IMAGE (URL OR UPLOAD)
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={post.ownerImage || ''}
                                          onChange={(e) =>
                                            updateOwnerBlog(post.id, {
                                              ownerImage: e.target.value,
                                            })
                                          }
                                          placeholder="Owner image URL..."
                                          className="flex-1 bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                        />
                                        <label className="px-2.5 py-2 text-[11px] font-mono text-white bg-[#222228] hover:bg-[#2c2c34] border border-white/15 rounded-xs flex items-center gap-1 cursor-pointer shrink-0">
                                          <Upload className="w-3 h-3 text-[#E31B23]" />
                                          <span>Upload</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                try {
                                                  const dataUrl = await readAndCompressImage(file);
                                                  updateOwnerBlog(post.id, {
                                                    ownerImage: dataUrl,
                                                  });
                                                  updateOwnerProfile({ image: dataUrl });
                                                } catch {
                                                  setFormNotice('Could not upload owner image.');
                                                }
                                              }
                                              e.target.value = '';
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[9px] font-mono text-[#888] block mb-1">
                                        ARTICLE COVER IMAGE (URL OR UPLOAD)
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={post.coverImage || ''}
                                          onChange={(e) =>
                                            updateOwnerBlog(post.id, {
                                              coverImage: e.target.value,
                                            })
                                          }
                                          placeholder="Article cover image URL..."
                                          className="flex-1 bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none focus:border-[#E31B23]"
                                        />
                                        <label className="px-2.5 py-2 text-[11px] font-mono text-white bg-[#222228] hover:bg-[#2c2c34] border border-white/15 rounded-xs flex items-center gap-1 cursor-pointer shrink-0">
                                          <ImageIcon className="w-3 h-3 text-[#E31B23]" />
                                          <span>Upload</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                try {
                                                  const dataUrl = await readAndCompressImage(file);
                                                  updateOwnerBlog(post.id, {
                                                    coverImage: dataUrl,
                                                  });
                                                } catch {
                                                  setFormNotice('Could not upload cover image.');
                                                }
                                              }
                                              e.target.value = '';
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-mono text-[#888] block mb-1">
                                      EXCERPT / SUMMARY
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={post.excerpt}
                                      onChange={(e) =>
                                        updateOwnerBlog(post.id, { excerpt: e.target.value })
                                      }
                                      className="w-full bg-[#161618] border border-white/10 rounded-xs p-2 text-xs text-white outline-none resize-none focus:border-[#E31B23]"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-mono text-[#888] block mb-1">
                                      FULL ESSAY CONTENT
                                    </label>
                                    <textarea
                                      rows={6}
                                      value={post.content}
                                      onChange={(e) =>
                                        updateOwnerBlog(post.id, { content: e.target.value })
                                      }
                                      className="w-full bg-[#161618] border border-white/10 rounded-xs p-2.5 text-xs text-white outline-none resize-y focus:border-[#E31B23]"
                                    />
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                                    <span className="text-xs font-mono text-emerald-400">
                                      ✓ Live updates synchronized!
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingBlogId(null);
                                        setSaveSuccess(true);
                                        setTimeout(() => setSaveSuccess(false), 2500);
                                      }}
                                      className="px-5 py-2 bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-all cursor-pointer"
                                    >
                                      Save &amp; Done Editing
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
