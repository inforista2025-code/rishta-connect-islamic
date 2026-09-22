import { MessageCircle, Users, Mail, Phone, Send, ShieldCheck, Heart, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "WhatsApp Channel",
      icon: MessageCircle,
      url: "https://www.whatsapp.com/channel/0029Vb6AIqPC1FuDwWaJVx0B",
      bgHover: "hover:bg-emerald-600",
    },
    {
      name: "WhatsApp Community",
      icon: Users,
      url: "https://chat.whatsapp.com/F0Sdw8mYaZ550w7vpcqqLi?mode=ems_wa_t",
      bgHover: "hover:bg-emerald-700",
    },
    {
      name: "Telegram Channel",
      icon: Send,
      url: "https://t.me/Rishtamatrimony",
      bgHover: "hover:bg-sky-500",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#2A0F1A] via-[#1F0A13] to-[#16060D] text-pink-100/90 border-t border-pink-900/40">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16">
        {minimal ? (
          <div className="flex flex-col items-center text-center gap-6 max-w-md mx-auto">
            <div>
              <div className="text-xl font-serif text-pink-300/90 mb-1">
                ﷽
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Rishta Matrimony</h3>
              <p className="text-xs text-pink-200/70 mt-1">
                Connecting Muslim hearts with authentic Islamic values
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-pink-200/80">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-pink-900/80">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span className="text-pink-900/80">•</span>
              <Link to="/contact" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>

            <div className="text-xs text-pink-300/50">
              <p>© {currentYear} Rishta Matrimony. All rights reserved.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              
              {/* Column 1: Brand & Islamic Mission */}
              <div className="space-y-4">
                <div className="text-xl font-serif text-pink-300/90">
                  ﷽
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    Rishta Matrimony
                  </h3>
                  <p className="text-xs text-pink-300 font-medium mt-0.5">
                    Halal Islamic Matchmaking Platform
                  </p>
                </div>
                <p className="text-xs text-pink-200/70 leading-relaxed">
                  Dedicated to helping practicing Muslims find righteous life partners according to the Quran & Sunnah with complete dignity and privacy.
                </p>
                <div className="pt-1 text-xs text-pink-200/90 font-serif italic">
                  مسلم دلوں کو اسلامی اقدار کے ساتھ جوڑنا
                </div>
              </div>

              {/* Column 2: Quick Rishta Services */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-primary pl-2.5">
                  Matrimonial
                </h4>
                <ul className="space-y-2 text-xs text-pink-200/70">
                  <li>
                    <Link to="/profiles" className="hover:text-pink-300 transition-colors">
                      Browse All Profiles
                    </Link>
                  </li>
                  <li>
                    <Link to="/profiles?gender=Female" className="hover:text-pink-300 transition-colors">
                      Verified Brides (Dulhan)
                    </Link>
                  </li>
                  <li>
                    <Link to="/profiles?gender=Male" className="hover:text-pink-300 transition-colors">
                      Verified Grooms (Dulha)
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-white transition-colors font-medium text-pink-300">
                      Free Biodata Registration
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-pink-300 transition-colors">
                      Premium Membership Plans
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Member Portal & Resources */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-primary pl-2.5">
                  Portal & Insights
                </h4>
                <ul className="space-y-2 text-xs text-pink-200/70">
                  <li>
                    <Link to="/member/login" className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-pink-200">
                      <LogIn className="w-3.5 h-3.5 text-primary" />
                      <span>Member Portal Login</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/about-us" className="hover:text-pink-300 transition-colors">
                      About Our Mission
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-pink-300 transition-colors">
                      Islamic Marriage Guidance
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="hover:text-pink-300 transition-colors">
                      Photo & Contact Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-pink-300 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth" className="hover:text-pink-200 text-pink-300/40 text-[11px] transition-colors">
                      Admin Portal
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact & Official Communities */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-primary pl-2.5">
                  Help & Channels
                </h4>
                
                {/* Contact Links */}
                <div className="space-y-2 text-xs text-pink-100">
                  <a 
                    href="https://wa.me/919128719875?text=Assalamu%20Alaikum%2C%20I%20have%20an%20inquiry%20regarding%20Rishta%20Matrimony."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp: +91 9128719875</span>
                  </a>
                  
                  <a 
                    href="mailto:info.rista2025@gmail.com"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span>info.rista2025@gmail.com</span>
                  </a>
                </div>

                {/* Social Community Buttons */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-pink-300/80 uppercase tracking-wider font-semibold">Join Official Community:</p>
                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-9 h-9 rounded-xl bg-pink-950/60 border border-pink-900/50 flex items-center justify-center text-pink-200 hover:text-white ${social.bgHover} transition-all duration-300 shadow-xs`}
                        title={social.name}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Bar: Trust & Copyright */}
            <div className="border-t border-pink-900/30 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pink-200/70">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <span className="flex items-center gap-1.5 text-pink-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Verified Islamic Profiles</span>
                </span>
                <span className="flex items-center gap-1.5 text-pink-200/80">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Complete Photo Privacy</span>
                </span>
              </div>

              <div className="text-center sm:text-right text-pink-300/50">
                <p>© {currentYear} Rishta Matrimony. All rights reserved.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}