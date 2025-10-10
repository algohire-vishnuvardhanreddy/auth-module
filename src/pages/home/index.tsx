import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Users, 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Brain,
  Clock,
  Shield
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Our advanced AI algorithms match candidates with perfect-fit roles in seconds.'
    },
    {
      icon: Clock,
      title: 'Save 80% Time',
      description: 'Automate screening, scheduling, and initial assessments to focus on what matters.'
    },
    {
      icon: Target,
      title: 'Precision Hiring',
      description: 'Data-driven insights ensure you hire the right talent every single time.'
    },
    {
      icon: Shield,
      title: 'Bias-Free Process',
      description: 'Fair and objective candidate evaluation powered by ethical AI technology.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Companies Trust Us' },
    { value: '500K+', label: 'Candidates Placed' },
    { value: '95%', label: 'Success Rate' },
    { value: '80%', label: 'Time Saved' }
  ];

  const benefits = [
    'Automated candidate screening and ranking',
    'Smart interview scheduling',
    'AI-generated job descriptions',
    'Real-time collaboration tools',
    'Advanced analytics dashboard',
    'Seamless ATS integration'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Recruiting Platform</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Hire Smarter, Not Harder
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                With AI Recruiting
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
              Transform your hiring process with intelligent automation. Find, assess, and hire 
              top talent 10x faster with our AI-powered recruiting platform.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition-all hover:border-slate-400"
              >
                Watch Demo
              </motion.button>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose AlgoHire?
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-slate-600">
              Leverage cutting-edge AI technology to revolutionize your recruitment process
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:shadow-indigo-200/50"
              >
                <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                Everything You Need to
                <span className="block text-indigo-600">Streamline Hiring</span>
              </h2>
              <p className="mb-8 text-lg text-slate-600">
                Our comprehensive platform provides all the tools you need to find, 
                evaluate, and hire the best candidates efficiently.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-indigo-600" />
                    <span className="text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <Users className="h-5 w-5 text-white" />
                      <span className="font-semibold text-white">Candidate Pipeline</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20">
                      <div className="h-full w-3/4 rounded-full bg-white"></div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-white" />
                      <span className="font-semibold text-white">Hiring Velocity</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20">
                      <div className="h-full w-5/6 rounded-full bg-white"></div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                    <div className="mb-2 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-white" />
                      <span className="font-semibold text-white">AI Match Score</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20">
                      <div className="h-full w-11/12 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Time to Hire</span>
                    <span className="text-2xl font-bold text-indigo-600">-80%</span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-2xl bg-indigo-200 blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-16 text-center shadow-2xl sm:px-16"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Ready to Transform Your Hiring?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-indigo-100">
                Join thousands of companies using AI to build exceptional teams. 
                Start your free trial today.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all hover:shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
                >
                  Schedule Demo
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
