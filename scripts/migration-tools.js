#!/usr/bin/env node

/**
 * Migration Tools for StudentPerks UI Refactoring
 * 
 * This script provides automated tools to help with the refactoring process:
 * - Update import statements
 * - Validate directory structure
 * - Generate component index files
 * - Check for duplicate code
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONFIG = {
  srcDir: './src',
  backupDir: './migration-backup',
  importMappings: {
    '../types/Deal': '@/shared/types',
    '../types/University': '@/shared/types',
    '../types/SubmittedDeal': '@/shared/types',
    '../services/apiClient': '@/shared/services/api/client',
    '../services/authService': '@/features/auth/services/authService',
    '../components/ui/': '@/shared/components/ui/',
    '../components/FormModal': '@/shared/components/forms/FormModal',
    '../contexts/AuthContext': '@/features/auth/contexts/AuthContext',
  },
  requiredDirectories: [
    'src/shared/components',
    'src/shared/hooks',
    'src/shared/types',
    'src/shared/services',
    'src/features/auth',
    'src/features/deals',
    'src/features/admin',
    'src/features/categories',
    'src/features/stores',
    'src/features/universities',
    'src/__tests__',
  ]
}

// Utility functions
const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

const createBackup = () => {
  log('Creating backup of current structure...', 'info')
  if (fs.existsSync(CONFIG.backupDir)) {
    execSync(`rm -rf ${CONFIG.backupDir}`)
  }
  execSync(`cp -r ${CONFIG.srcDir} ${CONFIG.backupDir}`)
  log('✅ Backup created successfully', 'success')
}

const createDirectoryStructure = () => {
  log('Creating new directory structure...', 'info')
  
  const directories = [
    // Shared directories
    'src/shared/components/ui',
    'src/shared/components/forms',
    'src/shared/components/layout',
    'src/shared/components/feedback',
    'src/shared/components/data-display',
    'src/shared/hooks/api',
    'src/shared/hooks/ui',
    'src/shared/hooks/utils',
    'src/shared/types/api',
    'src/shared/types/entities',
    'src/shared/types/common',
    'src/shared/services/api',
    'src/shared/utils',
    'src/shared/constants',
    
    // Feature directories
    'src/features/auth/components',
    'src/features/auth/hooks',
    'src/features/auth/services',
    'src/features/auth/types',
    'src/features/auth/contexts',
    
    'src/features/deals/components/forms',
    'src/features/deals/components/display',
    'src/features/deals/components/filters',
    'src/features/deals/hooks',
    'src/features/deals/services',
    'src/features/deals/types',
    
    'src/features/admin/components/dashboard',
    'src/features/admin/components/tables',
    'src/features/admin/components/stats',
    'src/features/admin/components/layout',
    'src/features/admin/hooks',
    'src/features/admin/services',
    'src/features/admin/types',
    
    'src/features/categories/components',
    'src/features/categories/hooks',
    'src/features/categories/services',
    'src/features/categories/types',
    
    'src/features/stores/components',
    'src/features/stores/hooks',
    'src/features/stores/services',
    'src/features/stores/types',
    
    'src/features/universities/components',
    'src/features/universities/hooks',
    'src/features/universities/services',
    'src/features/universities/types',
    
    // Test directories
    'src/__tests__/setup',
    'src/__tests__/mocks',
    'src/__tests__/utils',
    
    // Styles
    'src/styles'
  ]
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      log(`Created: ${dir}`, 'success')
    }
  })
  
  log('✅ Directory structure created', 'success')
}

const updateImports = (filePath) => {
  if (!fs.existsSync(filePath)) return
  
  let content = fs.readFileSync(filePath, 'utf8')
  let updated = false
  
  // Update import statements
  Object.entries(CONFIG.importMappings).forEach(([oldPath, newPath]) => {
    const regex = new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g')
    if (regex.test(content)) {
      content = content.replace(regex, `from '${newPath}'`)
      updated = true
    }
  })
  
  // Update relative imports to absolute
  const relativeImportRegex = /from ['"]\.\.\/([^'"]+)['"]/g
  const matches = content.match(relativeImportRegex)
  if (matches) {
    matches.forEach(match => {
      const relativePath = match.match(/from ['"]\.\.\/([^'"]+)['"]/)[1]
      
      // Determine the correct absolute path based on the relative path
      let absolutePath = ''
      if (relativePath.startsWith('components/ui/')) {
        absolutePath = `@/shared/components/ui/${relativePath.replace('components/ui/', '')}`
      } else if (relativePath.startsWith('components/')) {
        absolutePath = `@/shared/components/${relativePath.replace('components/', '')}`
      } else if (relativePath.startsWith('hooks/')) {
        absolutePath = `@/shared/hooks/${relativePath.replace('hooks/', '')}`
      } else if (relativePath.startsWith('types/')) {
        absolutePath = `@/shared/types/${relativePath.replace('types/', '')}`
      } else if (relativePath.startsWith('services/')) {
        absolutePath = `@/shared/services/${relativePath.replace('services/', '')}`
      }
      
      if (absolutePath) {
        content = content.replace(match, `from '${absolutePath}'`)
        updated = true
      }
    })
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content)
    return true
  }
  return false
}

const updateAllImports = () => {
  log('Updating import statements...', 'info')
  let updatedFiles = 0
  
  const processDirectory = (dir) => {
    if (!fs.existsSync(dir)) return
    
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        if (updateImports(filePath)) {
          updatedFiles++
          log(`Updated: ${filePath}`, 'info')
        }
      }
    })
  }
  
  processDirectory(CONFIG.srcDir)
  log(`✅ Updated imports in ${updatedFiles} files`, 'success')
}

const generateIndexFiles = () => {
  log('Generating index files...', 'info')
  
  const indexConfigs = [
    {
      dir: 'src/shared/types',
      exports: [
        "export * from './entities/deal'",
        "export * from './entities/university'",
        "export * from './entities/category'",
        "export * from './entities/store'",
        "export * from './entities/user'",
        "export * from './entities/submittedDeal'",
        "export * from './common/base'",
        "export * from './api/requests'",
        "export * from './api/responses'"
      ]
    },
    {
      dir: 'src/shared/components/forms',
      exports: [
        "export { FormModal } from './FormModal'",
        "export { FormField } from './FormField'",
        "export { FormActions } from './FormActions'"
      ]
    },
    {
      dir: 'src/shared/components/ui',
      exports: [
        "export * from './button'",
        "export * from './input'",
        "export * from './dialog'",
        "export * from './card'",
        "export * from './table'",
        "export * from './select'",
        "export * from './toast'"
      ]
    },
    {
      dir: 'src/features/deals/components',
      exports: [
        "export * from './forms'",
        "export * from './display'",
        "export * from './filters'"
      ]
    }
  ]
  
  indexConfigs.forEach(config => {
    if (fs.existsSync(config.dir)) {
      const indexPath = path.join(config.dir, 'index.ts')
      const content = config.exports.join('\n') + '\n'
      fs.writeFileSync(indexPath, content)
      log(`Created: ${indexPath}`, 'success')
    }
  })
  
  log('✅ Index files generated', 'success')
}

const validateStructure = () => {
  log('Validating directory structure...', 'info')
  
  const missing = CONFIG.requiredDirectories.filter(dir => !fs.existsSync(dir))
  
  if (missing.length > 0) {
    log('❌ Missing directories:', 'error')
    missing.forEach(dir => log(`  - ${dir}`, 'error'))
    return false
  }
  
  log('✅ Directory structure validated', 'success')
  return true
}

const findDuplicateCode = () => {
  log('Checking for duplicate code patterns...', 'info')
  
  const duplicates = []
  const patterns = [
    {
      name: 'FormData creation',
      regex: /const formData = new FormData\(\)/g,
      suggestion: 'Consider creating a utility function for FormData creation'
    },
    {
      name: 'Similar interface definitions',
      regex: /interface \w+Request \{[\s\S]*?\}/g,
      suggestion: 'Consider using generic base interfaces'
    },
    {
      name: 'Repeated error handling',
      regex: /catch \(error[^}]*\) \{[\s\S]*?throw error/g,
      suggestion: 'Consider centralizing error handling'
    }
  ]
  
  const processFile = (filePath) => {
    if (!fs.existsSync(filePath)) return
    
    const content = fs.readFileSync(filePath, 'utf8')
    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex)
      if (matches && matches.length > 1) {
        duplicates.push({
          file: filePath,
          pattern: pattern.name,
          count: matches.length,
          suggestion: pattern.suggestion
        })
      }
    })
  }
  
  const processDirectory = (dir) => {
    if (!fs.existsSync(dir)) return
    
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        processFile(filePath)
      }
    })
  }
  
  processDirectory(CONFIG.srcDir)
  
  if (duplicates.length > 0) {
    log('⚠️  Potential duplicate code found:', 'warning')
    duplicates.forEach(dup => {
      log(`  ${dup.file}: ${dup.pattern} (${dup.count} occurrences)`, 'warning')
      log(`    Suggestion: ${dup.suggestion}`, 'info')
    })
  } else {
    log('✅ No obvious duplicate code patterns found', 'success')
  }
}

const runTypeCheck = () => {
  log('Running TypeScript type check...', 'info')
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' })
    log('✅ Type check passed', 'success')
    return true
  } catch (error) {
    log('❌ Type check failed', 'error')
    return false
  }
}

const runTests = () => {
  log('Running tests...', 'info')
  try {
    execSync('npm test -- --passWithNoTests', { stdio: 'inherit' })
    log('✅ Tests passed', 'success')
    return true
  } catch (error) {
    log('❌ Tests failed', 'error')
    return false
  }
}

// Main commands
const commands = {
  backup: createBackup,
  structure: createDirectoryStructure,
  imports: updateAllImports,
  indexes: generateIndexFiles,
  validate: validateStructure,
  duplicates: findDuplicateCode,
  typecheck: runTypeCheck,
  test: runTests,
  
  // Combined commands
  setup: () => {
    createBackup()
    createDirectoryStructure()
    generateIndexFiles()
  },
  
  migrate: () => {
    createBackup()
    createDirectoryStructure()
    updateAllImports()
    generateIndexFiles()
  },
  
  check: () => {
    const structureValid = validateStructure()
    findDuplicateCode()
    const typesValid = runTypeCheck()
    const testsValid = runTests()
    
    if (structureValid && typesValid && testsValid) {
      log('✅ All checks passed!', 'success')
      return true
    } else {
      log('❌ Some checks failed', 'error')
      return false
    }
  }
}

// CLI interface
const command = process.argv[2]

if (!command || !commands[command]) {
  log('Available commands:', 'info')
  Object.keys(commands).forEach(cmd => {
    log(`  node scripts/migration-tools.js ${cmd}`, 'info')
  })
  process.exit(1)
}

try {
  commands[command]()
} catch (error) {
  log(`Error executing ${command}: ${error.message}`, 'error')
  process.exit(1)
}