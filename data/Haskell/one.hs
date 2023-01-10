{-# LANGUAGE TemplateHaskell, QuasiQuotes, DeriveDataTypeable, RecordWildCards, ForeignFunctionInterface #-}
{-# LANGUAGE NamedFieldPuns, EmptyDataDecls, MagicHash #-}

-- |
-- Module      : Graphics.SpriteKit.Scene
-- Copyright   : [2014] Manuel M T Chakravarty
-- License     : BSD3
--
-- Maintainer  : Manuel M T Chakravarty <chak@justtesting.org>
-- Stability   : experimental
--
-- SpriteKit scene nodes.

module Graphics.SpriteKit.Scene (

  -- ** Scene representation
  Scene(..), SceneUpdate, EventHandler,
  
  -- ** Scene creation
  sceneWithSize,

  -- ** Marshalling functions (internal)
  sceneToSKNode, sceneToForeignPtr,

  scene_initialise
) where

  -- standard libraries
import Control.Applicative
import Control.Exception as Exc
import Data.Typeable
import Data.Maybe
import Foreign           hiding (void)
import GHC.Prim          (reallyUnsafePtrEquality#)
import System.IO.Unsafe  (unsafePerformIO)
import Unsafe.Coerce     (unsafeCoerce)

  -- friends
import Graphics.SpriteKit.Color
import Graphics.SpriteKit.Event
import Graphics.SpriteKit.Geometry
import Graphics.SpriteKit.Node
import Graphics.SpriteKit.PhysicsWorld
import Graphics.SpriteKit.Types

  -- language-c-inline
import Language.C.Quote.ObjC
import Language.C.Inline.ObjC

objc_import ["<Cocoa/Cocoa.h>", "<SpriteKit/SpriteKit.h>", "GHC/HsFFI.h", "HaskellSpriteKit/StablePtrBox.h"]
