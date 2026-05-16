import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Dices, Wand2, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SHOT_TYPES = ["Portrait", "Full Body", "Close-up", "Wide Shot", "Aerial", "Macro"];
const LIGHTING_STYLES = ["Golden Hour", "Studio Softbox", "Rembrandt", "Natural Window", "Dramatic Side Light", "Night Scene"];
const ART_STYLES = ["Photorealistic", "Cinematic Film", "Editorial Fashion", "Fine Art", "Documentary", "Painterly"];

const RANDOM_SUBJECTS = ["A lone astronaut", "A cybernetic samurai", "A wise old owl", "A vintage sports car", "Two ballet dancers"];
const RANDOM_MOODS = ["Ethereal and dreamy", "Gritty and tense", "Melancholic", "Triumphant", "Mysterious"];
const RANDOM_SETTINGS = ["Neon-lit alleyway in Tokyo", "Abandoned gothic cathedral", "Lush alien jungle", "Sun-drenched Mediterranean villa"];

export default function Home() {
  const { toast } = useToast();
  
  const [subject, setSubject] = useState("");
  const [mood, setMood] = useState("");
  const [setting, setSetting] = useState("");
  const [shotType, setShotType] = useState("");
  const [lighting, setLighting] = useState("");
  const [artStyle, setArtStyle] = useState("");

  const [prompts, setPrompts] = useState<{title: string; content: string}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRandomize = () => {
    setSubject(RANDOM_SUBJECTS[Math.floor(Math.random() * RANDOM_SUBJECTS.length)]);
    setMood(RANDOM_MOODS[Math.floor(Math.random() * RANDOM_MOODS.length)]);
    setSetting(RANDOM_SETTINGS[Math.floor(Math.random() * RANDOM_SETTINGS.length)]);
    setShotType(SHOT_TYPES[Math.floor(Math.random() * SHOT_TYPES.length)]);
    setLighting(LIGHTING_STYLES[Math.floor(Math.random() * LIGHTING_STYLES.length)]);
    setArtStyle(ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)]);
  };

  const generatePrompts = () => {
    if (!subject || !mood || !setting || !shotType || !lighting || !artStyle) {
      toast({
        title: "Missing details",
        description: "Please fill out all fields or use the Randomize button.",
        variant: "destructive"
      });
      return;
    }

    const realism = `Photorealistic ${shotType.toLowerCase()} of ${subject}, ${setting}. Shot on 35mm lens, f/1.8, cinematic film still. Lighting: ${lighting}. Mood: ${mood}. Detailed 8k resolution, Unreal Engine 5 render style, filmic color grading, depth of field.`;
    const editorial = `High-end editorial ${shotType.toLowerCase()} of ${subject}, ${setting}. Vogue magazine photography style, ${lighting} setup. Mood: ${mood}. Medium format photography, f/8, sharp focus, striking composition, stylish wardrobe, ${artStyle} influences.`;
    const documentary = `Candid documentary ${shotType.toLowerCase()} of ${subject}, ${setting}. Magnum photos style, authentic and unposed. Lighting: ${lighting}. Mood: ${mood}. Shot on 50mm, f/4, natural film grain, realistic textures, ${artStyle} elements.`;
    
    let negPrompt = "blurry, out of focus, deformed, ugly, bad anatomy, bad lighting, noise, text, watermark";
    if (artStyle === "Photorealistic" || artStyle === "Cinematic Film") {
      negPrompt += ", illustration, painting, cartoon, 3d, fake, render, artificial, poorly drawn";
    } else if (artStyle === "Painterly" || artStyle === "Fine Art") {
      negPrompt += ", photo, real, camera, lens, overexposed, digital render";
    }

    setPrompts([
      { title: "Cinematic Realism", content: realism },
      { title: "Editorial / Fashion", content: editorial },
      { title: "Documentary / Candid", content: documentary },
      { title: "Negative Prompt", content: negPrompt }
    ]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Prompt is ready to paste."
    });
  };

  const copyAll = () => {
    const allText = prompts.map(p => `--- ${p.title} ---\n${p.content}`).join("\n\n");
    navigator.clipboard.writeText(allText);
    toast({
      title: "Copied all prompts",
      description: "All variations copied to clipboard."
    });
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-6 md:p-12 font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Prompt Alchemist</h1>
            <p className="text-muted-foreground text-sm">Craft professional, cinematic image generation prompts in seconds.</p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Scene Configuration</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleRandomize} title="Randomize inputs" className="hover:text-primary hover:bg-primary/10 transition-colors">
                  <Dices className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Scene</Label>
                <Textarea 
                  id="subject" 
                  placeholder="e.g. three elderly women in an autumn park" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="resize-none h-20 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setting">Setting / Location</Label>
                <Input 
                  id="setting" 
                  placeholder="e.g. sunlit path, golden leaves" 
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Mood / Emotion</Label>
                <Input 
                  id="mood" 
                  placeholder="e.g. joyful, dignified, warm" 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Shot Type</Label>
                <Select value={shotType} onValueChange={setShotType}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select shot type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHOT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lighting Style</Label>
                <Select value={lighting} onValueChange={setLighting}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select lighting" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIGHTING_STYLES.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Art Style</Label>
                <Select value={artStyle} onValueChange={setArtStyle}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {ART_STYLES.map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generatePrompts} 
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-medium group"
              >
                <Wand2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                Generate Prompts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between h-10">
            <h2 className="text-xl font-semibold text-white">Generated Variations</h2>
            {prompts.length > 0 && (
              <Button variant="outline" size="sm" onClick={copyAll} className="border-border/50 hover:bg-muted">
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy All
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {prompts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-[400px] flex flex-col items-center justify-center border border-dashed border-border/50 rounded-xl text-muted-foreground bg-muted/10"
                >
                  <Wand2 className="h-8 w-8 mb-4 opacity-50" />
                  <p>Configure your scene and hit generate.</p>
                </motion.div>
              )}

              {prompts.map((prompt, index) => (
                <motion.div
                  key={prompt.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card overflow-hidden group">
                    <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary">{prompt.title}</span>
                        <span className="text-xs text-muted-foreground font-mono">{prompt.content.length} chars</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(prompt.content, index)}
                      >
                        {copiedIndex === index ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed font-mono text-muted-foreground">
                        {prompt.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
