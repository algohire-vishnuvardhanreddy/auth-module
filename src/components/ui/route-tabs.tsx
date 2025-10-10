'use client'

import { useEffect, useState } from 'react'
import { useRouter, useLocation } from '@tanstack/react-router'
import { AnimatedTabs, type Tab } from './animated-tabs'

interface RouteTabsProps {
  tabs: Omit<Tab, 'content'>[]
  defaultPath?: string
  className?: string
}

export function RouteTabs({ tabs, defaultPath, className }: RouteTabsProps) {
  const router = useRouter()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<string>('')
  const pathname = location.pathname

  // Set the active tab based on the current pathname
  useEffect(() => {
    const matchingTab = tabs.find(
      (tab) => tab.href && pathname.startsWith(tab.href)
    )
    if (matchingTab) {
      setActiveTab(matchingTab.value)
    } else if (defaultPath) {
      // If no matching tab is found, use the default path
      setActiveTab(
        tabs.find((tab) => tab.href === defaultPath)?.value || tabs[0].value
      )
    } else {
      // Fallback to the first tab
      setActiveTab(tabs[0].value)
    }
  }, [pathname, tabs, defaultPath])

  const handleTabChange = (value: string) => {
    const selectedTab = tabs.find((tab) => tab.value === value)
    if (selectedTab?.href) {
      router.navigate({ to: selectedTab.href })
    }
  }

  return (
    <AnimatedTabs
      tabs={tabs}
      defaultValue={activeTab}
      onTabChange={handleTabChange}
      className={className}
    />
  )
}
