import SyntaxHighlighter from 'react-syntax-highlighter'
import { useEffect, useState } from 'react'
import { INITIAL_DATA_LAYER_OBJECT_BANK, INITIAL_DATA_LAYER_OBJECT_DENGI, DYNAMIC_PARAMETERS } from '@/shared/config'
import { getFormattedObjectString } from '@/shared/lib/getFormattedObjectString'

export const MainPageSettings = () => (
  <>
    <h1>Настройки</h1>
    <h2>Динамические параметры</h2>
    <SyntaxHighlighter>{JSON.stringify(DYNAMIC_PARAMETERS)}</SyntaxHighlighter>
    <h2>Банк</h2>
    <SyntaxHighlighter>{getFormattedObjectString(INITIAL_DATA_LAYER_OBJECT_BANK)}</SyntaxHighlighter>
    <h2>Деньги</h2>
    <SyntaxHighlighter>{getFormattedObjectString(INITIAL_DATA_LAYER_OBJECT_DENGI)}</SyntaxHighlighter>
  </>
)