import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  MessageCircle,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  PhoneCall,
  Search,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  Copy,
  ExternalLink,
  BookOpen,
  Users
} from 'lucide-react';

interface AILead {
  id: string;
  full_name: string;
  whatsapp_number: string;
  residence_location: string;
  occupation_details: string; // contains query
  family_details: string; // contains timestamp or source
  partner_preferences: string; // contains lookingFor
  created_at: string;
}

interface CustomFAQ {
  id: string;
  question: string;
  answer: string;
  keywords?: string;
}

interface KnowledgeDoc {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const DEFAULT_FAQS: CustomFAQ[] = [
  {
    id: 'faq-1',
    question: 'How much does it cost to register a profile?',
    answer: 'Biodata registration is 100% FREE for both brides and grooms at /register. You can fill the form, submit your details, and our admin team will verify it within 24-48 hours.',
    keywords: 'register, free, cost, fee, biodata, registration'
  },
  {
    id: 'faq-2',
    question: 'What are the charges for unlocking phone numbers?',
    answer: 'Single Profile Unlock is ₹48 one-time for direct phone number and family contact. Premium Membership is ₹491 for 60 Days with unlimited verified profile unlocks and priority support.',
    keywords: 'fee, unlock, price, 48, 491, plan, charges, money, premium'
  },
  {
    id: 'faq-3',
    question: 'Is photo parda (privacy) respected?',
    answer: 'Yes, absolutely. Sisters and brothers can opt for photo parda / blur mode. Photos and contact numbers are never published on public search engines or social media.',
    keywords: 'photo, parda, privacy, blur, picture, safety, women'
  },
  {
    id: 'faq-4',
    question: 'What is the platform policy on Dowry (Jahez)?',
    answer: 'Dowry (Jahez) is strictly forbidden on our platform according to the Sunnah of Prophet Muhammad ﷺ. We believe in simple, blessed nikah (Aisarun-Nikah Barkatan).',
    keywords: 'dowry, jahez, demand, sunnah, money'
  },
  {
    id: 'faq-5',
    question: 'How does verification work?',
    answer: 'Every profile goes through a strict manual phone verification by our admin team within 24-48 hours before being marked verified and made active.',
    keywords: 'verify, verification, fake, genuine, check, phone call'
  }
];

export function AIKnowledgeManager() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'leads' | 'faqs' | 'docs' | 'settings'>('leads');

  // Leads State
  const [leads, setLeads] = useState<AILead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');

  // Knowledge Base State
  const [faqs, setFaqs] = useState<CustomFAQ[]>(DEFAULT_FAQS);
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // New FAQ form modal state
  const [editingFaq, setEditingFaq] = useState<CustomFAQ | null>(null);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqKeywords, setNewFaqKeywords] = useState('');

  // New Doc form state
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');

  // 1. Load Leads from Supabase
  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registration_submissions')
        .select('*')
        .eq('referral', 'ai_chatbot_lead')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data as any[]) || []);
    } catch (err: any) {
      console.warn('Error loading AI leads:', err);
    } finally {
      setLeadsLoading(false);
    }
  };

  // 2. Load Knowledge Base from Supabase about_us_content
  const loadKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('*')
        .eq('language', 'ai_knowledge_base')
        .maybeSingle();

      if (error) {
        console.warn('Could not load dynamic knowledge base row:', error);
        return;
      }

      if (data && data.content) {
        try {
          const parsed = JSON.parse(data.content);
          if (Array.isArray(parsed.faqs) && parsed.faqs.length > 0) {
            setFaqs(parsed.faqs);
          }
          if (Array.isArray(parsed.documents)) {
            setDocs(parsed.documents);
          }
          if (parsed.customPrompt) {
            setCustomPrompt(parsed.customPrompt);
          }
          if (parsed.geminiApiKey) {
            setGeminiApiKey(parsed.geminiApiKey);
          }
        } catch (jsonErr) {
          console.warn('Error parsing knowledge base JSON:', jsonErr);
        }
      }
    } catch (err) {
      console.warn('Load knowledge base failed:', err);
    }
  };

  useEffect(() => {
    loadLeads();
    loadKnowledgeBase();
  }, []);

  // Save Knowledge Base to Supabase
  const saveKnowledgeBase = async (updatedFaqs = faqs, updatedDocs = docs, updatedKey = geminiApiKey, updatedPrompt = customPrompt) => {
    setIsSaving(true);
    try {
      const payload = {
        faqs: updatedFaqs,
        documents: updatedDocs,
        customPrompt: updatedPrompt,
        geminiApiKey: updatedKey,
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('about_us_content')
        .upsert(
          {
            language: 'ai_knowledge_base',
            title: 'AI Assistant Knowledge Base & FAQs',
            content: JSON.stringify(payload),
            updated_at: new Date().toISOString()
          },
          { onConflict: 'language' }
        );

      if (error) throw error;

      toast({
        title: 'Knowledge Base Saved!',
        description: 'AI will now ground all answers using your updated questions & documents.'
      });
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not update knowledge base in database.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add / Edit FAQ
  const handleSaveFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please provide both a Question and an Answer.',
        variant: 'destructive'
      });
      return;
    }

    let updated: CustomFAQ[];
    if (editingFaq) {
      updated = faqs.map(f => f.id === editingFaq.id ? {
        ...f,
        question: newFaqQ.trim(),
        answer: newFaqA.trim(),
        keywords: newFaqKeywords.trim()
      } : f);
    } else {
      const newEntry: CustomFAQ = {
        id: `faq-${Date.now()}`,
        question: newFaqQ.trim(),
        answer: newFaqA.trim(),
        keywords: newFaqKeywords.trim()
      };
      updated = [newEntry, ...faqs];
    }

    setFaqs(updated);
    saveKnowledgeBase(updated);
    setEditingFaq(null);
    setNewFaqQ('');
    setNewFaqA('');
    setNewFaqKeywords('');
  };

  const handleDeleteFaq = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    saveKnowledgeBase(updated);
    toast({ title: 'Question removed from AI Knowledge Base' });
  };

  const handleStartEditFaq = (faq: CustomFAQ) => {
    setEditingFaq(faq);
    setNewFaqQ(faq.question);
    setNewFaqA(faq.answer);
    setNewFaqKeywords(faq.keywords || '');
  };

  // Add Document
  const handleAddDoc = () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please enter a title and document text.',
        variant: 'destructive'
      });
      return;
    }

    const newDoc: KnowledgeDoc = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      content: newDocContent.trim(),
      updatedAt: new Date().toLocaleDateString()
    };

    const updated = [newDoc, ...docs];
    setDocs(updated);
    saveKnowledgeBase(faqs, updated);
    setNewDocTitle('');
    setNewDocContent('');
    toast({ title: 'Document added to AI Knowledge Base!' });
  };

  const handleDeleteDoc = (id: string) => {
    const updated = docs.filter(d => d.id !== id);
    setDocs(updated);
    saveKnowledgeBase(faqs, updated);
    toast({ title: 'Document removed' });
  };

  // Test Gemini Key
  const handleTestGeminiKey = async () => {
    if (!geminiApiKey || geminiApiKey.trim().length < 10) {
      toast({
        title: 'Invalid Key',
        description: 'Please paste your Google Gemini API Key first.',
        variant: 'destructive'
      });
      return;
    }

    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the single word: READY' }] }]
        })
      });

      if (res.ok) {
        setTestResult({
          success: true,
          message: '🟢 Gemini 1.5 Flash Connected Successfully! AI Brain is active.'
        });
        toast({ title: 'Gemini Key Validated!' });
        saveKnowledgeBase(faqs, docs, geminiApiKey);
      } else {
        const errText = await res.text();
        setTestResult({
          success: false,
          message: `Connection failed (${res.status}): ${errText.substring(0, 100)}`
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: `Network error: ${e.message}`
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('registration_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLeads(leads.filter(l => l.id !== id));
      toast({ title: 'Lead deleted' });
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    }
  };

  const filteredLeads = leads.filter(l => {
    const term = leadSearch.toLowerCase();
    return (
      l.full_name?.toLowerCase().includes(term) ||
      l.whatsapp_number?.includes(term) ||
      l.residence_location?.toLowerCase().includes(term) ||
      l.occupation_details?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              AI Knowledge Base & Lead Engine
              <Badge className="bg-emerald-600 text-white text-xs">Gemini 1.5 Powered</Badge>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800">
              Train the AI with your own answers, upload guideline files, and view captured visitor WhatsApp leads.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { loadLeads(); loadKnowledgeBase(); }}
            className="border-emerald-300 text-emerald-800 hover:bg-emerald-100"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => saveKnowledgeBase()}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-1 bg-muted/60">
          <TabsTrigger value="leads" className="flex items-center gap-2 py-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>AI Leads</span>
            {leads.length > 0 && (
              <Badge className="bg-emerald-600 text-white ml-1 text-xs px-1.5 py-0 h-5">
                {leads.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2 py-2">
            <MessageCircle className="w-4 h-4 text-blue-600" />
            <span>Q&A Training ({faqs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2 py-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Files & Docs ({docs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 py-2">
            <KeyRound className="w-4 h-4 text-purple-600" />
            <span>AI & Gemini Key</span>
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* TAB 1: AI LEADS TRACKER */}
        {/* ============================================================== */}
        <TabsContent value="leads" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-emerald-900">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Captured Website Leads ({filteredLeads.length})
                  </CardTitle>
                  <CardDescription>
                    Visitors who interacted with the AI and provided their Name & WhatsApp number.
                  </CardDescription>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {leadsLoading ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-muted-foreground">No leads captured yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    When visitors chat with the AI on your website and enter their phone number to receive rishtas, they will appear right here with 1-click WhatsApp buttons.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Visitor Name</TableHead>
                        <TableHead>WhatsApp Number</TableHead>
                        <TableHead>City / Looking For</TableHead>
                        <TableHead>Visitor Query / Note</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => {
                        const cleanPhone = (lead.whatsapp_number || '').replace(/\D/g, '');
                        const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                          `Assalamu Alaikum ${lead.full_name}! Aapne Rishta Matrimony par inquiry ki thi. Hum aapko verified rishte share karne ke liye hazir hain.`
                        )}`;

                        return (
                          <TableRow key={lead.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                  {lead.full_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span>{lead.full_name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  +91 {cleanPhone}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                  onClick={() => {
                                    navigator.clipboard.writeText(cleanPhone);
                                    toast({ title: 'Phone number copied!' });
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <span className="font-medium text-foreground">{lead.residence_location || 'Not Specified'}</span>
                                {lead.partner_preferences && (
                                  <div className="text-muted-foreground text-[11px]">
                                    {lead.partner_preferences}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                              {lead.occupation_details || 'General inquiry'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(lead.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1.5 rounded-md shadow-sm transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteLead(lead.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 2: CUSTOM Q&A TRAINING */}
        {/* ============================================================== */}
        <TabsContent value="faqs" className="space-y-4 pt-2">
          {/* Add / Edit Card */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-blue-950">
                <Plus className="w-4 h-4 text-blue-600" />
                {editingFaq ? 'Edit Q&A Training Entry' : 'Train AI with a New Question & Exact Answer'}
              </CardTitle>
              <CardDescription className="text-xs">
                When a visitor asks anything related to this question or keywords, the AI will answer exactly as written here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Question (User Query):
                </label>
                <Input
                  placeholder="e.g. Can parents register on behalf of their children?"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Exact Answer (How the AI should respond):
                </label>
                <Textarea
                  placeholder="e.g. Yes, absolutely! Parents, brothers, or guardians can easily create and manage the biodata for their children..."
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  rows={3}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Keywords / Trigger Words (comma-separated, optional):
                </label>
                <Input
                  placeholder="e.g. walidain, parents, father, mother, bacha, beta, beti"
                  value={newFaqKeywords}
                  onChange={(e) => setNewFaqKeywords(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleSaveFaq}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {editingFaq ? 'Update Q&A' : 'Add to AI Knowledge'}
                </Button>
                {editingFaq && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingFaq(null);
                      setNewFaqQ('');
                      setNewFaqA('');
                      setNewFaqKeywords('');
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* List of FAQs */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center justify-between">
              <span>Active Trained Questions ({faqs.length})</span>
              <span className="text-xs text-muted-foreground">Automatically grounds Gemini Flash & Fallback Engine</span>
            </h3>

            {faqs.map((faq, idx) => (
              <Card key={faq.id} className="hover:border-blue-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="font-semibold text-sm text-blue-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {faq.question}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line pl-7">
                        {faq.answer}
                      </p>
                      {faq.keywords && (
                        <div className="flex flex-wrap gap-1 pl-7 pt-1">
                          {faq.keywords.split(',').map((k, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] bg-muted/40 font-normal">
                              {k.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleStartEditFaq(faq)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteFaq(faq.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 3: DOCUMENTS & GUIDELINES */}
        {/* ============================================================== */}
        <TabsContent value="docs" className="space-y-4 pt-2">
          <Card className="border-amber-200 bg-amber-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-amber-950">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Upload Guidelines, Rules & Policy Documents
              </CardTitle>
              <CardDescription className="text-xs">
                Upload or paste full policies, rules, and community documents. The AI reads these documents to answer any detailed questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Document Title:
                </label>
                <Input
                  placeholder="e.g. Complete Platform Rules & Nikah Guidelines 2026"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Document Text Content (Paste text or guideline):
                </label>
                <Textarea
                  placeholder="Paste rules, verification protocols, refund policy, code of conduct..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  rows={5}
                  className="bg-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={handleAddDoc}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Document to AI Knowledge
                </Button>

                {/* Quick File Import button */}
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 border border-amber-300 rounded-md px-3 py-1.5 bg-amber-100/50">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Import .txt / .md File</span>
                  <input
                    type="file"
                    accept=".txt,.md,.json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewDocTitle(file.name.replace(/\.[^/.]+$/, ''));
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const content = event.target?.result as string;
                          if (content) setNewDocContent(content);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Documents List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">
              Active Documents ({docs.length})
            </h3>

            {docs.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg bg-muted/10 text-muted-foreground text-xs">
                No custom documents uploaded yet. You can paste rules or upload .txt files above.
              </div>
            ) : (
              docs.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-600" />
                          {doc.title}
                          <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
                            Added: {doc.updatedAt}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono bg-muted/40 p-2 rounded max-h-24 overflow-y-auto whitespace-pre-wrap">
                          {doc.content.substring(0, 300)}...
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteDoc(doc.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* TAB 4: AI & GEMINI SETTINGS */}
        {/* ============================================================== */}
        <TabsContent value="settings" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-purple-950">
                <KeyRound className="w-4 h-4 text-purple-600" />
                Google Gemini AI Brain Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Gemini 1.5 Flash provides 1,500 requests per day for <strong>100% Free</strong> forever.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-foreground">
                    Google Gemini API Key:
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    Get Free Gemini API Key from Google <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      className="font-mono text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleTestGeminiKey}
                    disabled={isTestingKey}
                    className="border-purple-300 text-purple-800 hover:bg-purple-50"
                  >
                    {isTestingKey ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1 text-purple-600" />}
                    Test Connection
                  </Button>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-md text-xs font-medium border ${testResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {testResult.message}
                  </div>
                )}
              </div>

              {/* Custom Prompt Persona */}
              <div className="space-y-1.5 pt-2 border-t">
                <label className="text-xs font-semibold text-foreground">
                  Custom Tone & Instructions (Optional):
                </label>
                <Textarea
                  placeholder="e.g. Always greet with 'Assalamu Alaikum'. Be very warm and respectful. Frequently remind visitors that registration is 100% free."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  className="text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  This custom prompt will guide Gemini on how to speak and represent Rishta Matrimony.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => saveKnowledgeBase()}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                  Save AI Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
