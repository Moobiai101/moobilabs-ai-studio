import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  VideoIcon, 
  ImageIcon, 
  ScissorsIcon, 
  PenToolIcon,
  SparklesIcon, 
  MicIcon, 
  ZapIcon, 
  BrushIcon
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const tools = [
    {
      title: "Video Generation",
      description: "Generate videos with Haiilo, Pika, Runway, Luma models",
      href: "/tools/video-generation",
      icon: <VideoIcon className="h-5 w-5" />
    },
    {
      title: "Image Generation",
      description: "Generate images with custom styles in Flux and Ideogram",
      href: "/tools/image-generation",
      icon: <ImageIcon className="h-5 w-5" />
    },
    {
      title: "Realtime",
      description: "Realtime AI rendering on a canvas with instant feedback loops",
      href: "/tools/realtime",
      icon: <ZapIcon className="h-5 w-5" />
    },
    {
      title: "Enhancer",
      description: "Upscale and enhance real and generated images up to 4K",
      href: "/tools/enhancer",
      icon: <BrushIcon className="h-5 w-5" />
    }
  ]

  const categories = [
    {
      title: "Create",
      tools: tools
    },
    {
      title: "Edit",
      tools: [
        {
          title: "Video Editing",
          description: "Edit your videos with AI assistance",
          href: "/tools/video-editing",
          icon: <ScissorsIcon className="h-5 w-5" />
        },
        {
          title: "Image Editing",
          description: "Edit your images with AI tools",
          href: "/tools/image-editing",
          icon: <PenToolIcon className="h-5 w-5" />
        },
        {
          title: "VFX Generation",
          description: "Create stunning visual effects",
          href: "/tools/vfx",
          icon: <SparklesIcon className="h-5 w-5" />
        },
        {
          title: "Voice & Dubbing",
          description: "Generate and edit voice content",
          href: "/tools/voice-dubbing",
          icon: <MicIcon className="h-5 w-5" />
        }
      ]
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Home</h1>
      </div>

      {categories.map((category, i) => (
        <div key={i} className="mb-10">
          <h2 className="text-lg font-medium mb-4">{category.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.tools.map((tool, j) => (
              <Link 
                key={j} 
                href={tool.href}
                className="group"
              >
                <div className="bg-secondary-900 p-4 rounded-lg border border-border h-full hover:border-primary/50 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-md bg-secondary-800 text-primary mr-3">
                      {tool.icon}
                    </div>
                    <h3 className="font-medium">{tool.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
      
      {/* Featured Template */}
      <div className="mt-12 mb-8">
        <h2 className="text-lg font-medium mb-4">Featured</h2>
        <div className="bg-gradient-to-r from-secondary-800 to-secondary-900 rounded-lg overflow-hidden border border-border">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-2">Video Restyle</h3>
              <p className="text-muted-foreground mb-6">
                Change the style of any video. Turn videos of your friends into 3D animations, 
                clone dances, craft totally new video styles.
              </p>
              <Link 
                href="/tools/video-generation"
                className="inline-block bg-primary text-white px-5 py-2 rounded-md text-center font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
              >
                Try Now
              </Link>
            </div>
            <div className="bg-secondary-900 h-64 md:h-auto">
              {/* This would be an image or video preview */}
              <div className="w-full h-full flex items-center justify-center">
                <VideoIcon className="h-16 w-16 text-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 