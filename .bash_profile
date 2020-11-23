export PATH=$HOME/bin:$PATH

# if running bash
if [ -n "$BASH_VERSION" ]; then
  # include .bashrc if it exists
  if [ -f "$HOME/.bashrc" ]; then
      . "$HOME/.bashrc"
  else 
    # Christopher Collins - Aliases
    if [ -f ~/.ccollins_aliases ]; then
      . ~/.ccollins_aliases
    fi
  fi
fi
