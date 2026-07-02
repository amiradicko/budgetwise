#!/bin/bash
# Script de build pour Vercel

# Build shared d'abord
npm run build --workspace=shared

# Puis build client
npm run build --workspace=client
